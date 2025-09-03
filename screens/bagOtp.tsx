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
  const [currentCheckStep, setCurrentCheckStep] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  const otpRefs = Array(4)
    .fill(null)
    .map(() => useRef<TextInput>(null));

  const checkSteps = [
    "Getting Device Details",
    "Getting location", 
    "Checking Device health",
    "Registering on Offstrap Cloud"
  ];

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
    setCurrentCheckStep(0);
    
    // Start the step-by-step checking animation
    checkSteps.forEach((_, index) => {
      setTimeout(() => {
        setCurrentCheckStep(index + 1);
      }, (index + 1) * 1500); // 1.5 seconds between each step
    });

    // Navigate after all steps complete
    setTimeout(() => {
      navigation.navigate("Dashboard", {
        bagData: {
          otp: otp.join(""),
          bagName: bagName,
        },
      });
    }, checkSteps.length * 1500 + 1000); // Wait for all steps + 1 second buffer
  };

  const isOtpComplete = otp.every((d) => d !== "");
  const isFormValid = otpVerified && bagName.trim().length >= 2;

  // fix layout shift
  useEffect(() => {
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {});
    return () => hideSub.remove();
  }, []);

  // Step checking component
  const StepChecking = () => {
    return (
      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>Setting up your bag...</Text>
        
        {checkSteps.map((stepText, index) => {
          const isCompleted = currentCheckStep > index;
          const isActive = currentCheckStep === index + 1;
          
          return (
            <View key={index} style={styles.stepRow}>
              <View style={[
                styles.stepIndicator,
                isCompleted && styles.stepCompleted,
                isActive && styles.stepActive
              ]}>
                {isCompleted ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </View>
              <Text style={[
                styles.stepText,
                isCompleted && styles.stepTextCompleted,
                isActive && styles.stepTextActive
              ]}>
                {stepText}
              </Text>
              {isActive && (
                <View style={styles.loadingDots}>
                  <Animated.View style={[styles.dot, styles.dot1]} />
                  <Animated.View style={[styles.dot, styles.dot2]} />
                  <Animated.View style={[styles.dot, styles.dot3]} />
                </View>
              )}
            </View>
          );
        })}
        
        {currentCheckStep >= checkSteps.length && (
          <View style={styles.allSetContainer}>
            <Text style={styles.allSetText}>All Set! 🎉</Text>
          </View>
        )}
      </View>
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
                  
                ]}
                onPress={handleProceed}
                disabled={!isFormValid}
              >
                <Text style={styles.proceedButtonText}>Proceed</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Step 3: Step Checking Animation */}
          {step === 3 && <StepChecking />}
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
  // Step checking styles
  stepsContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  stepsTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#555",
  },
  stepActive: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  stepCompleted: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  stepNumber: {
    color: "#999",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  stepText: {
    fontSize: 16,
    color: "#999",
    flex: 1,
  },
  stepTextActive: {
    color: "#2196F3",
    fontWeight: "600",
  },
  stepTextCompleted: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2196F3",
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  allSetContainer: {
    alignItems: "center",
    marginTop: 30,
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  allSetText: {
    fontSize: 20,
    color: "#4CAF50",
    fontWeight: "bold",
  },
});