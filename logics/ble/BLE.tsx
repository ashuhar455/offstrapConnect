// src/ble/NusBleService.ts
import { BleManager, Device } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import base64 from 'react-native-base64';

/** Nordic UART Service UUIDs */
export const NUS_UUID = {
  SERVICE:        '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
  RX_CHAR_WRITE:  '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // Write/WriteWithoutResponse (App -> Device)
  TX_CHAR_NOTIFY: '6e400003-b5a3-f393-e0a9-e50e24dcca9e', // Notify (Device -> App)
} as const;

/** Utils: Hex <-> Bytes */
export function bytesToHex(bytes: Uint8Array): string {
  const lut = Array.from({ length: 256 }, (_, i) =>
    i.toString(16).padStart(2, '0')
  );
  let out = '';
  for (let i = 0; i < bytes.length; i++) out += lut[bytes[i]];
  return out;
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/0x/gi, '').replace(/\s+/g, '').toLowerCase();
  if (clean.length === 0) return new Uint8Array(0);
  if (clean.length % 2 !== 0) {
    throw new Error('Hex string must have even length');
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    const byte = parseInt(clean.substr(i, 2), 16);
    if (Number.isNaN(byte)) throw new Error('Invalid hex byte in: ' + clean.substr(i, 2));
    out[i / 2] = byte;
  }
  return out;
}

type ReceiveBytes = (data: Uint8Array) => void;
type ReceiveHex = (hex: string) => void;
type LogFn = (msg: string, ...args: any[]) => void;

export interface ScanResult {
  id: string;
  name?: string | null;
  rssi?: number | null;
  device: Device;
}

export interface NusBleOptions {
  onReceiveBytes?: ReceiveBytes;  // raw bytes callback
  onReceiveHex?: ReceiveHex;      // hex string callback
  onLog?: LogFn;                  // optional logger
}

export class NusBleService {
  private manager = new BleManager();
  private device: Device | null = null;
  private txSub: { remove: () => void } | null = null;
  private onReceiveBytes?: ReceiveBytes;
  private onReceiveHex?: ReceiveHex;
  private onLog?: LogFn;
  private mtu = 23; // default ATT MTU; payload ~= mtu - 3

  constructor(opts?: NusBleOptions) {
    this.onReceiveBytes = opts?.onReceiveBytes;
    this.onReceiveHex = opts?.onReceiveHex;
    this.onLog = opts?.onLog;
  }

  private log = (msg: string, ...args: any[]) => {
    if (this.onLog) this.onLog(msg, ...args);
  };

  /** ANDROID: runtime permissions */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    const api = Platform.Version as number;

    try {
      if (api >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        const ok =
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
        return ok;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (e) {
      this.log('Permission error', e);
      return false;
    }
  }

  /** Scan for devices advertising NUS */
  startScan(onDevice: (res: ScanResult) => void): void {
    this.log('Scan start (NUS filter)');
    this.manager.startDeviceScan([NUS_UUID.SERVICE], null, (error, device) => {
      if (error) {
        this.log('Scan error', error);
        return;
      }
      if (!device) return;
      onDevice({ id: device.id, name: device.name, rssi: device.rssi, device });
    });
  }

  stopScan(): void {
    this.log('Scan stop');
    this.manager.stopDeviceScan();
  }

  /** Connect + discover + (Android) request MTU + enable notifications */
  async connect(deviceId: string, opts?: { requestMtu?: number }): Promise<Device> {
    this.log('Connecting', deviceId);
    const device = await this.manager.connectToDevice(deviceId, { autoConnect: false });
    this.device = device;

    this.log('Discovering GATT');
    await device.discoverAllServicesAndCharacteristics();

    if (Platform.OS === 'android') {
      const mtuReq = opts?.requestMtu ?? 247;
      try {
        const d = await device.requestMTU(mtuReq);
        this.mtu = d.mtu ?? mtuReq;
      } catch (e) {
        this.log('MTU request failed; using default', e);
        this.mtu = 23;
      }
      this.log('MTU set =', this.mtu);
    } else {
      // iOS negotiates automatically; effective payload ~185 for BLE 4.2+
      this.mtu = 185 + 3;
    }

    await this.enableNotifications();
    return device;
  }

  /** Enable notify on TX; decode to bytes + hex */
  private async enableNotifications(): Promise<void> {
    if (!this.device) throw new Error('No device');

    this.log('Enable TX notifications');
    const sub = this.manager.monitorCharacteristicForDevice(
      this.device.id,
      NUS_UUID.SERVICE,
      NUS_UUID.TX_CHAR_NOTIFY,
      (error, characteristic) => {
        if (error) {
          this.log('Notify error', error);
          return;
        }
        if (!characteristic?.value) return;

        // Base64 -> bytes
        const raw = base64.decode(characteristic.value);
        const bytes = Uint8Array.from(Array.from(raw).map(c => c.charCodeAt(0)));
        // Callbacks
        if (this.onReceiveBytes) this.onReceiveBytes(bytes);
        if (this.onReceiveHex) this.onReceiveHex(bytesToHex(bytes));
      }
    );

    this.txSub = { remove: () => sub.remove() };
  }

  /** Send raw bytes (chunked for MTU) */
  async sendBytes(bytes: Uint8Array): Promise<void> {
    if (!this.device) throw new Error('No device connected');

    const maxPayload = Math.max(20, this.mtu - 3); // ATT header = 3
    for (let i = 0; i < bytes.length; i += maxPayload) {
      const chunk = bytes.slice(i, i + maxPayload);
      const b64 = base64.encode(String.fromCharCode(...Array.from(chunk)));
      try {
        await this.manager.writeCharacteristicWithoutResponseForDevice(
          this.device.id,
          NUS_UUID.SERVICE,
          NUS_UUID.RX_CHAR_WRITE,
          b64
        );
      } catch (e) {
        // Fallback with response
        await this.manager.writeCharacteristicWithResponseForDevice(
          this.device.id,
          NUS_UUID.SERVICE,
          NUS_UUID.RX_CHAR_WRITE,
          b64
        );
      }
      // Tiny pacing can help flaky peripherals
      await new Promise(res => setTimeout(res, 5));
    }
  }

  /** Send hex string (accepts "0x" prefix, whitespace) */
  async sendHex(hex: string): Promise<void> {
    const bytes = hexToBytes(hex);
    await this.sendBytes(bytes);
  }

  /** Convenience: send UTF-8 text */
  async sendText(text: string): Promise<void> {
    const enc = new TextEncoder();
    await this.sendBytes(enc.encode(text));
  }

  /** Disconnect + cleanup */
  async disconnect(): Promise<void> {
    this.log('Disconnect');
    if (this.txSub) {
      try { this.txSub.remove(); } catch {}
      this.txSub = null;
    }
    if (this.device) {
      try { await this.manager.cancelDeviceConnection(this.device.id); } catch (e) {
        this.log('cancelDeviceConnection error', e);
      }
      this.device = null;
    }
  }

  /** Destroy BLE manager (call on app unmount) */
  destroy(): void {
    this.log('Destroy manager');
    if (this.txSub) { try { this.txSub.remove(); } catch {} }
    this.txSub = null;
    this.device = null;
    this.manager.destroy();
  }

  /** Helpers */
  isConnected(): boolean { return !!this.device; }
  getConnectedDeviceId(): string | null { return this.device?.id ?? null; }
}
