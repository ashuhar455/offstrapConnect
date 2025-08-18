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

export default function BagOtpNameScreen({ navigation, route }: Props) {
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [otpVerified, setOtpVerified] = useState(false);
  const [bagName, setBagName] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  const otpRefs = Array(4)
    .fill(null)
    .map(() => useRef<TextInput>(null));

  const handleOtpChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // auto move next
      if (text && index < 3) {
        otpRefs[index + 1].current?.focus();
      }
    }
  };

  const handleVerify = () => {
    setTimeout(() => {
      setOtpVerified(true);
      setStep(2); // move to bag name step
    }, 800);
  };

  const handleProceed = () => {
    setStep(3); // Move to success animation step
    
    // Start the success animation sequence
    Animated.sequence([
      // Scale up the container
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Draw the checkmark
      Animated.timing(checkmarkAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();

    // Navigate after animation completes
    setTimeout(() => {
      navigation.navigate("Dashboard", {
        bagData: {
          otp: otp.join(""),
          bagName: bagName,
        },
      });
    }, 2000);
  };

  const isOtpComplete = otp.every((d) => d !== "");
  const isFormValid = otpVerified && bagName.trim().length >= 2;

  // fix layout shift
  useEffect(() => {
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {});
    return () => hideSub.remove();
  }, []);

  // Animated checkmark component
  const AnimatedCheckmark = () => {
    return (
      <Animated.View 
        style={[
          styles.successContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: scaleAnim,
          }
        ]}
      >
        <View style={styles.checkmarkCircle}>
          <Animated.View
            style={[
              styles.checkmark,
              {
                transform: [
                  {
                    rotate: checkmarkAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['45deg', '45deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.checkmarkStem,
                {
                  height: checkmarkAnim.interpolate({
                    inputRange: [0, 0.6, 1],
                    outputRange: [0, 0, 25],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.checkmarkKick,
                {
                  width: checkmarkAnim.interpolate({
                    inputRange: [0, 0.6, 1],
                    outputRange: [0, 12, 12],
                  }),
                },
              ]}
            />
          </Animated.View>
        </View>
        <Text style={styles.successText}>Bag Setup Complete!</Text>
      </Animated.View>
    );
  };

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
          {step !== 3 && (
            <>
              <Text style={styles.title}>Let's set up your bag</Text>
              <Text style={styles.subtitle}>
                {step === 1
                  ? "Enter the 4-digit OTP to verify"
                  : "Now give your bag a name"}
              </Text>
            </>
          )}

          {/* Step 1: OTP */}
          {step === 1 && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Enter 4-digit OTP</Text>
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
                <Text style={styles.verifyText}>
                  {otpVerified ? "Verified" : "Verify"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: Bag Name */}
          {step === 2 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Bag Name</Text>
                <TextInput
                  style={styles.input}
                  value={bagName}
                  onChangeText={setBagName}
                  placeholder="Ashish's Offstrap Trail 1.0"
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

          {/* Step 3: Success Animation */}
          {step === 3 && <AnimatedCheckmark />}
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
    fontSize: 26,
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
  otpBoxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  otpBox: {
    width: 55,
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
  // Success animation styles
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  checkmarkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  checkmark: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkStem: {
    position: "absolute",
    width: 4,
    backgroundColor: "#fff",
    left: 15,
    top: 10,
    borderRadius: 2,
  },
  checkmarkKick: {
    position: "absolute",
    height: 4,
    backgroundColor: "#fff",
    left: 8,
    top: 20,
    borderRadius: 2,
    transform: [{ rotate: "-45deg" }],
  },
  successText: {
    fontSize: 24,
    color: "#4CAF50",
    fontWeight: "bold",
    textAlign: "center",
  },
});