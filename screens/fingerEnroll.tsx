import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated
} from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

// Original Lottie animation data
const fingerprintAnimation = {"v":"5.0.1","fr":60,"ip":0,"op":120,"w":48,"h":48,"ddd":0,"assets":[],"layers":[{"ind":3,"nm":"Layer 3","ks":{"p":{"a":0,"k":[24,24]},"a":{"a":0,"k":[15.5,15.5,0]},"s":{"a":0,"k":[120,120,100]},"r":{"a":0,"k":0},"o":{"a":1,"k":[{"t":6,"s":[0],"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"e":[0]},{"t":43,"s":[0],"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"e":[100]},{"t":45,"s":[100]}]}},"ao":0,"ip":0,"op":105,"st":0,"bm":0,"sr":1,"ty":4,"shapes":[{"ty":"gr","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[1.829,9.222],[6.841,13.454],[16.687,1.367]],"c":false},"hd":false}},{"ty":"st","c":{"a":0,"k":[0.961,0.949,0.953,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":2.074},"lc":1,"lj":1,"ml":4,"d":[{"n":"d","nm":"dash","v":{"a":0,"k":22.15}},{"n":"g","nm":"gap","v":{"a":0,"k":22.15}},{"n":"o","nm":"offset","v":{"a":1,"k":[{"t":82,"s":[22.15],"i":{"x":[0.175],"y":[1]},"o":{"x":[0.77],"y":[0]},"e":[0]},{"t":102,"s":[0]}]}}]},{"ty":"tr","p":{"a":0,"k":[6.242,8.089]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false},{"ty":"gr","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"i":[[0,0],[8.56,0],[0,8.56],[-8.56,0],[0,-8.56]],"o":[[0,8.56],[-8.56,0],[0,-8.56],[8.56,0],[0,0]],"v":[[15.5,0],[0,15.5],[-15.5,0],[0,-15.5],[15.5,0]],"c":true},"hd":false}},{"ty":"st","c":{"a":0,"k":[0.09411764705882353,0.8431372549019608,0.5372549019607843,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":2},"lc":2,"lj":2,"ml":4,"d":[{"n":"d","nm":"dash","v":{"a":0,"k":96.78}},{"n":"g","nm":"gap","v":{"a":0,"k":96.78}},{"n":"o","nm":"offset","v":{"a":1,"k":[{"t":43,"s":[-96.78],"i":{"x":[0.58],"y":[1]},"o":{"x":[0.42],"y":[0]},"e":[0]},{"t":77,"s":[0]}]}}]},{"ty":"tr","p":{"a":0,"k":[15.5,15.5]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":-203},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false},{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[31,31]},"p":{"a":0,"k":[0,0]}},{"ty":"st","c":{"a":0,"k":[0.09411764705882353,0.8431372549019608,0.5372549019607843,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":2},"lc":1,"lj":1,"ml":4},{"ty":"fl","c":{"a":0,"k":[0.09411764705882353,0.8431372549019608,0.5372549019607843,1]},"hd":false,"o":{"a":0,"k":100},"r":1},{"ty":"tr","p":{"a":0,"k":[15.5,15.5]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":-203},"o":{"a":1,"k":[{"t":77,"s":[0],"i":{"x":[0.58],"y":[1]},"o":{"x":[0.42],"y":[0]},"e":[100]},{"t":105,"s":[100]}]},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false}]},{"ind":2,"nm":"red","ks":{"p":{"a":0,"k":[24,23.994]},"a":{"a":0,"k":[17.1,19.006,0]},"s":{"a":1,"k":[{"t":41,"s":[100,100,100],"i":{"x":[0.58],"y":[1]},"o":{"x":[0.42],"y":[0]},"e":[60,60,100]},{"t":69,"s":[60,60,100]}]},"r":{"a":1,"k":[{"t":49,"s":[0],"i":{"x":[0.58],"y":[1]},"o":{"x":[0.42],"y":[0]},"e":[-39]},{"t":73,"s":[-39]}]},"o":{"a":1,"k":[{"t":41,"s":[100],"i":{"x":[0.58],"y":[1]},"o":{"x":[0.42],"y":[0]},"e":[0]},{"t":69,"s":[0]}]}},"ao":0,"ip":0,"op":105,"st":0,"bm":0,"sr":1,"ty":4,"shapes":[{"ty":"gr","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"i":[[0,0],[-7.1,1.35]],"o":[[0,5.8],[0,0]],"v":[[-0.1,0.45],[12.1,9.9]],"c":false},"hd":false}},{"ty":"st","c":{"a":0,"k":[0.09411764705882353,0.8431372549019608,0.5372549019607843,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":2},"lc":2,"lj":1,"ml":4,"d":[{"n":"d","nm":"dash","v":{"a":0,"k":17.6}},{"n":"g","nm":"gap","v":{"a":0,"k":17.6}},{"n":"o","nm":"offset","v":{"a":1,"k":[{"t":6,"s":[-17.6],"i":{"x":[0.355],"y":[1]},"o":{"x":[0.645],"y":[0.045]},"e":[0]},{"t":37,"s":[0]}]}}]},{"ty":"tr","p":{"a":0,"k":[17.1,23.762]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false},{"ty":"gr","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"i":[[0,0],[-2.5,2.5],[-0.8,-10.8]],"o":[[-8.5,-9],[5.55,-5.55],[0,0]],"v":[[-0.7,-0.5],[-4.2,-20],[14.1,-13.7]],"c":false},"hd":false}},{"ty":"st","c":{"a":0,"k":[0.09411764705882353,0.8431372549019608,0.5372549019607843,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":2},"lc":2,"lj":1,"ml":4,"d":[{"n":"d","nm":"dash","v":{"a":0,"k":46.01}},{"n":"g","nm":"gap","v":{"a":0,"k":46.01}},{"n":"o","nm":"offset","v":{"a":1,"k":[{"t":6,"s":[46.01],"i":{"x":[0.355],"y":[1]},"o":{"x":[0.645],"y":[0.045]},"e":[0]},{"t":37,"s":[0]}]}}]},{"ty":"tr","p":{"a":0,"k":[13.3,38.012]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false},{"ty":"gr","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"i":[[0,0],[-10.5,0],[-1.5,-10.5],[4.638,0.994],[8,0.5],[-12,-3]],"o":[[-4.674,-13.472],[4.272,-0.001],[0.5,3.5],[-7,-1.5],[-8.982,-0.561],[0,0]],"v":[[-1.92,18.918],[12.08,-3.582],[27.58,9.918],[21.08,15.918],[12.08,6.417],[18.08,24.918]],"c":false},"hd":false}},{"ty":"st","c":{"a":0,"k":[0.09411764705882353,0.8431372549019608,0.5372549019607843,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":2},"lc":2,"lj":1,"ml":4,"d":[{"n":"d","nm":"dash","v":{"a":0,"k":105.63}},{"n":"g","nm":"gap","v":{"a":0,"k":105.63}},{"n":"o","nm":"offset","v":{"a":1,"k":[{"t":6,"s":[105.63],"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"e":[0]},{"t":43,"s":[0]}]}}]},{"ty":"tr","p":{"a":0,"k":[5.02,13.094]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false},{"ty":"gr","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"i":[[0,0],[-8.1,-11.5]],"o":[[9.1,-11.5],[0,0]],"v":[[-5.02,5.42],[29.18,5.42]],"c":false},"hd":false}},{"ty":"st","c":{"a":0,"k":[0.09411764705882353,0.8431372549019608,0.5372549019607843,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":2},"lc":2,"lj":1,"ml":4,"d":[{"n":"d","nm":"dash","v":{"a":0,"k":39.65}},{"n":"g","nm":"gap","v":{"a":0,"k":39.65}},{"n":"o","nm":"offset","v":{"a":1,"k":[{"t":6,"s":[-39.65],"i":{"x":[0.355],"y":[1]},"o":{"x":[0.645],"y":[0.045]},"e":[0]},{"t":37,"s":[0]}]}}]},{"ty":"tr","p":{"a":0,"k":[5.02,8.092]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false},{"ty":"gr","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"i":[[0,0],[-8.08,-4.5]],"o":[[6.7,-3.5],[0,0]],"v":[[0.38,0],[23.78,0]],"c":false},"hd":false}},{"ty":"st","c":{"a":0,"k":[0.09411764705882353,0.8431372549019608,0.5372549019607843,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":1.9},"lc":2,"lj":1,"ml":4,"d":[{"n":"d","nm":"dash","v":{"a":0,"k":24.35}},{"n":"g","nm":"gap","v":{"a":0,"k":24.35}},{"n":"o","nm":"offset","v":{"a":1,"k":[{"t":6,"s":[-24.35],"i":{"x":[0.355],"y":[1]},"o":{"x":[0.645],"y":[0.045]},"e":[0]},{"t":37,"s":[0]}]}}]},{"ty":"tr","p":{"a":0,"k":[5.02,3.012]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false}],"ln":"red"},{"ind":1,"nm":"gray","ks":{"p":{"a":0,"k":[24,23.994]},"a":{"a":0,"k":[17.1,19.006,0]},"s":{"a":0,"k":[100,100,100]},"r":{"a":0,"k":0},"o":{"a":1,"k":[{"t":42,"s":[100],"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"e":[0]},{"t":43,"s":[0]}]}},"ao":0,"ip":0,"op":105,"st":0,"bm":0,"sr":1,"ty":4,"shapes":[{"ty":"gr","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"i":[[0,0],[-7.1,1.35]],"o":[[0,5.8],[0,0]],"v":[[-0.1,0.45],[12.1,9.9]],"c":false},"hd":false}},{"ty":"st","c":{"a":0,"k":[0.847,0.847,0.847,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":2},"lc":2,"lj":1,"ml":4},{"ty":"tr","p":{"a":0,"k":[17.1,23.762]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false},{"ty":"gr","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"i":[[0,0],[-2.5,2.5],[-0.8,-10.8]],"o":[[-8.5,-9],[5.55,-5.55],[0,0]],"v":[[-0.7,-0.5],[-4.2,-20],[14.1,-13.7]],"c":false},"hd":false}},{"ty":"st","c":{"a":0,"k":[0.847,0.847,0.847,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":2},"lc":2,"lj":1,"ml":4},{"ty":"tr","p":{"a":0,"k":[13.3,38.012]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false},{"ty":"gr","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"i":[[0,0],[-10.5,0],[-1.5,-10.5],[4.638,0.994],[8,0.5],[-12,-3]],"o":[[-4.674,-13.472],[4.272,-0.001],[0.5,3.5],[-7,-1.5],[-8.982,-0.561],[0,0]],"v":[[-1.92,18.918],[12.08,-3.582],[27.58,9.918],[21.08,15.918],[12.08,6.417],[18.08,24.918]],"c":false},"hd":false}},{"ty":"st","c":{"a":0,"k":[0.847,0.847,0.847,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":2},"lc":2,"lj":1,"ml":4},{"ty":"tr","p":{"a":0,"k":[5.02,13.094]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false},{"ty":"gr","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"i":[[0,0],[-8.1,-11.5]],"o":[[9.1,-11.5],[0,0]],"v":[[-5.02,5.42],[29.18,5.42]],"c":false},"hd":false}},{"ty":"st","c":{"a":0,"k":[0.847,0.847,0.847,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":2},"lc":2,"lj":1,"ml":4},{"ty":"tr","p":{"a":0,"k":[5.02,8.092]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false},{"ty":"gr","it":[{"ty":"sh","d":1,"ks":{"a":0,"k":{"i":[[0,0],[-8.08,-4.5]],"o":[[6.7,-3.5],[0,0]],"v":[[0.38,0],[23.78,0]],"c":false},"hd":false}},{"ty":"st","c":{"a":0,"k":[0.847,0.847,0.847,1]},"o":{"a":0,"k":100},"w":{"a":0,"k":1.9},"lc":2,"lj":1,"ml":4,"d":[{"n":"d","nm":"dash","v":{"a":0,"k":24.35}},{"n":"g","nm":"gap","v":{"a":0,"k":24.35}},{"n":"o","nm":"offset","v":{"a":0,"k":0}}]},{"ty":"tr","p":{"a":0,"k":[5.02,3.012]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0}}],"nm":"Object","hd":false}],"ln":"gray"}],"markers":[]};

const ENROLLMENT_STAGES = {
  WAITING_FOR_FINGER: 'waiting_for_finger',
  CAPTURING: 'capturing',
  LIFT_AND_REPOSITION: 'lift_and_reposition'
};

const CAPTURE_ANGLES = [
  'Center',
  'Slightly left',
  'Slightly right',
  'Upper area',
  'Lower area',
  'Left edge',
  'Right edge',
  'Upper left',
  'Upper right',
  'Final scan'
];

export default function FingerprintEnrollmentScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStage, setCurrentStage] = useState(ENROLLMENT_STAGES.WAITING_FOR_FINGER);
  const [isEnrollmentStarted, setIsEnrollmentStarted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);
  const timeoutRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animation steps for breaking the Lottie into 10 parts
  const animationSteps = [
    { start: 0, end: 3 },
    { start: 3, end: 7 },
    { start: 7, end: 11 },
    { start: 11, end: 16 },
    { start: 16, end: 22 },
    { start: 22, end: 28 },
    { start: 28, end: 35 },
    { start: 35, end: 40 },
    { start: 40, end: 43 },
    { start: 43, end: 105 }, // Changed from 100 to 105 to match animation length
  ];

  const getRandomDelay = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const startPulseAnimation = () => {
    setIsAnimating(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    setIsAnimating(false);
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const startEnrollmentProcess = () => {
    if (isEnrollmentStarted) return;
    
    setIsEnrollmentStarted(true);
    processNextStep();
  };

  const processNextStep = () => {
    // Stage 1: Waiting for finger placement (1-2 seconds)
    setCurrentStage(ENROLLMENT_STAGES.WAITING_FOR_FINGER);
    
    timeoutRef.current = setTimeout(() => {
      // Stage 2: Capturing fingerprint (2-4 seconds)
      setCurrentStage(ENROLLMENT_STAGES.CAPTURING);
      startPulseAnimation();
      
      // Play specific segment of Lottie animation
      const step = animationSteps[currentStep];
      if (animationRef.current) {
        // Convert frame numbers to seconds (assuming 60fps)
        const startTime = (step.start / 60) * 1000;
        const endTime = (step.end / 60) * 1000;
        
        // Play the specific segment
        animationRef.current.play(startTime, endTime);
      }
      
      const captureDelay = currentStep === 9 ? getRandomDelay(3000, 4000) : getRandomDelay(2000, 4000);
      
      timeoutRef.current = setTimeout(() => {
        stopPulseAnimation();
        
        if (currentStep < 9) {
          // Stage 3: Lift and reposition (1-2 seconds)
          setCurrentStage(ENROLLMENT_STAGES.LIFT_AND_REPOSITION);
          
          timeoutRef.current = setTimeout(() => {
            setCurrentStep(prev => prev + 1);
            processNextStep();
          }, getRandomDelay(1000, 2000));
        } else {
          // Enrollment complete
          setCurrentStep(10);
          setCurrentStage(ENROLLMENT_STAGES.CAPTURING);
        }
      }, captureDelay);
    }, getRandomDelay(1000, 2000));
  };

  const resetEnrollment = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    stopPulseAnimation();
    setCurrentStep(0);
    setCurrentStage(ENROLLMENT_STAGES.WAITING_FOR_FINGER);
    setIsEnrollmentStarted(false);
    
    if (animationRef.current) {
      animationRef.current.reset();
    }
  };

  const getStatusText = () => {
    if (currentStep >= 10) {
      return "Fingerprint enrollment complete!";
    }

    switch (currentStage) {
      case ENROLLMENT_STAGES.WAITING_FOR_FINGER:
        return `Place your finger on the sensor\n${CAPTURE_ANGLES[currentStep]} position`;
      case ENROLLMENT_STAGES.CAPTURING:
        return `Capturing fingerprint...\nHold still (${currentStep + 1}/10)`;
      case ENROLLMENT_STAGES.LIFT_AND_REPOSITION:
        return `Lift your finger\nPreparing for next capture...`;
      default:
        return "Ready to start enrollment";
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / 10) * 100;
  };

  const getSensorStyle = () => {
    if (currentStep >= 10) {
      return [styles.fingerprintCircle, styles.fingerprintCircleSuccess];
    }
    
    switch (currentStage) {
      case ENROLLMENT_STAGES.CAPTURING:
        return [styles.fingerprintCircle, styles.fingerprintCircleActive];
      case ENROLLMENT_STAGES.LIFT_AND_REPOSITION:
        return [styles.fingerprintCircle, styles.fingerprintCircleWarning];
      default:
        return styles.fingerprintCircle;
    }
  };

  // Fallback fingerprint icon component
  const FingerprintIcon = () => (
    <View style={styles.fingerprintIconContainer}>
    
    </View>
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stopPulseAnimation();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Fingerprint Setup</Text>
        <Text style={styles.subtitle}>
          We'll capture your fingerprint from multiple angles to ensure accuracy
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { width: `${getProgressPercentage()}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentStep}/10 captures completed
        </Text>
      </View>

      <View style={styles.animationContainer}>
        <Animated.View 
          style={[
            getSensorStyle(),
            {
              transform: [{ scale: pulseAnim }]
            }
          ]}
        >
          {/* Try Lottie animation first, fallback to custom icon */}
          <LottieView
            ref={animationRef}
            source={fingerprintAnimation}
            style={styles.lottieAnimation}
            loop={currentStage === ENROLLMENT_STAGES.CAPTURING}
            autoPlay={false}
            onAnimationFinish={() => {
              if (currentStage === ENROLLMENT_STAGES.CAPTURING && currentStep < 9) {
                animationRef.current?.play();
              }
            }}
          />
          
          {/* Fallback icon - will show if Lottie fails */}
          <View style={styles.fallbackIcon}>
            <FingerprintIcon />
          </View>
        </Animated.View>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {currentStep < 10 ? (
          !isEnrollmentStarted ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={startEnrollmentProcess}
            >
              <Text style={styles.startButtonText}>Start Enrollment</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={resetEnrollment}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )
        ) : (
          <View style={styles.completedButtonsContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetEnrollment}
            >
              <Text style={styles.resetButtonText}>Start Over</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => console.log('Continue to next step')}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.stepIndicatorContainer}>
        {Array.from({ length: 10 }, (_, index) => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              index < currentStep && styles.stepIndicatorCompleted,
              index === currentStep && currentStage === ENROLLMENT_STAGES.CAPTURING && styles.stepIndicatorActive
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  animationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerprintCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
  },
  fingerprintCircleActive: {
    borderColor: '#007AFF',
    backgroundColor: '#001122',
    elevation: 10,
  },
  fingerprintCircleWarning: {
    borderColor: '#FF9500',
    backgroundColor: '#221100',
  },
  fingerprintCircleSuccess: {
    borderColor: '#34C759',
    backgroundColor: '#002211',
    elevation: 10,
  },
  lottieAnimation: {
    width: 120,
    height: 120,
    position: 'absolute',
  },
  fallbackIcon: {
    position: 'absolute',
    opacity: 0.8,
  },
  fingerprintIconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerprintLine1: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  fingerprintLine2: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  fingerprintLine3: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  fingerprintLine4: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  statusContainer: {
    alignItems: 'center',
    marginVertical: 30,
    minHeight: 60,
  },
  statusText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  completedButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resetButton: {
    backgroundColor: '#333',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    flex: 0.45,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    flex: 0.45,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  stepIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  stepIndicatorCompleted: {
    backgroundColor: '#34C759',
  },
  stepIndicatorActive: {
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.2 }],
  },
});