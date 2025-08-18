import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Keyboard,
} from "react-native";

interface Props {
  navigation: any;
  route?: any;
}

export default function PhoneNameScreen({ navigation, route }: Props) {
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [step, setStep] = useState<1 | 2>(1); // step control
  const [showBagCard, setShowBagCard] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const userData = route?.params?.userData || {};

  const handleVerify = () => {
    // simulate OTP verification
    setTimeout(() => {
      setPhoneVerified(true);
      setStep(2); // move to name input step
    }, 1000);
  };

  const handleProceed = () => {
    setShowBagCard(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      navigation.navigate("Discovery", {
        userData: {
          ...userData,
          phoneNumber: `${countryCode} ${phoneNumber}`,
          displayName: displayName,
        },
      });
    }, 2000);
  };

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // auto focus next
      if (text && index < 5) {
        const nextInput = otpRefs[index + 1].current;
        nextInput?.focus();
      }
    }
  };

  const otpRefs = Array(6)
    .fill(null)
    .map(() => useRef<TextInput>(null));

  const isOtpComplete = otp.every((digit) => digit !== "");
  const isFormValid = phoneVerified && displayName.trim().length >= 2;

  // Fix white space when keyboard hides
  useEffect(() => {
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {});
    return () => hideSub.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {!showBagCard ? (
            <>
              <Text style={styles.title}>Let's set up your profile</Text>
              <Text style={styles.subtitle}>
                {step === 1
                  ? "Verify your phone number first"
                  : "Now tell us your name"}
              </Text>

              {/* Step 1: Phone + OTP */}
              {step === 1 && (
                <>
                  {/* Phone Number */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.phoneRow}>
                      <TextInput
                        style={[styles.input, styles.countryInput]}
                        value={countryCode}
                        onChangeText={setCountryCode}
                        placeholder="+91"
                        placeholderTextColor="#666"
                        keyboardType="phone-pad"
                        maxLength={4}
                      />
                      <TextInput
                        style={[styles.input, styles.phoneInput]}
                        value={phoneNumber}
                        onChangeText={(text) => setPhoneNumber(text)}
                        placeholder="Enter your phone number"
                        placeholderTextColor="#666"
                        keyboardType="phone-pad"
                        maxLength={15}
                      />
                    </View>
                  </View>

                  {/* OTP Input Boxes */}
                  {phoneNumber.length >= 10 && (
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Enter 6-digit OTP</Text>
                      <View style={styles.otpBoxRow}>
                        {otp.map((digit, idx) => (
                          <TextInput
                            key={idx}
                            ref={otpRefs[idx]}
                            style={styles.otpBox}
                            value={digit}
                            onChangeText={(text) => handleOtpChange(text, idx)}
                            keyboardType="numeric"
                            maxLength={1}
                            returnKeyType="next"
                          />
                        ))}
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.verifyBtn,
                          !isOtpComplete && styles.disabledButton,
                        ]}
                        onPress={handleVerify}
                        disabled={!isOtpComplete}
                      >
                        <Text style={styles.verifyText}>Verify</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}

              {/* Step 2: Name */}
              {step === 2 && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>What should we call you?</Text>
                    <TextInput
                      style={styles.input}
                      value={displayName}
                      onChangeText={setDisplayName}
                      placeholder="Enter your name"
                      placeholderTextColor="#666"
                      maxLength={50}
                      autoCapitalize="words"
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.proceedButton,
                      !isFormValid && styles.disabledButton,
                    ]}
                    onPress={handleProceed}
                    disabled={!isFormValid}
                  >
                    <Text style={styles.proceedButtonText}>Proceed</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.nextSection}>
                <Text style={styles.nextTitle}>Now let's add your first bag</Text>
                <Text style={styles.nextSubtitle}>
                  We'll help you set up your Offstrap bag and get it ready for
                  tracking
                </Text>
              </View>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  inputContainer: { marginBottom: 25 },
  label: { fontSize: 16, color: "#fff", marginBottom: 8, fontWeight: "600" },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  countryInput: { flex: 0.3, marginRight: 10, textAlign: "center" },
  phoneInput: { flex: 1 },
  otpBoxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  otpBox: {
    width: 45,
    height: 55,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  verifyBtn: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  verifyText: { color: "#000", fontWeight: "bold", textAlign: "center" },
  nextSection: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    marginVertical: 30,
    borderWidth: 1,
    borderColor: "#333",
  },
  nextTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  nextSubtitle: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 20,
  },
  proceedButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  disabledButton: { backgroundColor: "#333", opacity: 0.6 },
  proceedButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
