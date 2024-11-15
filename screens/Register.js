import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated, StatusBar as RNStatusBar } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Colors
const Colors = {
  primary: "#ffffff",
  secondary: "#E5E7EB",
  tertiary: "#1F2937",
  darkLight: "#9CA3AF",
  green: "#10B981",
  red: "#EF4444",
  black: "#000000"
};
const { darkLight, primary, secondary, tertiary } = Colors;

// Validation Schema
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

const Register = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  
  // Animated focus states
  const [emailFocusAnimation] = useState(new Animated.Value(1));
  const [passwordFocusAnimation] = useState(new Animated.Value(1));
  const [confirmFocusAnimation] = useState(new Animated.Value(1));
  const [focusedField, setFocusedField] = useState(null);

  const handleFocus = (field) => {
    setFocusedField(field);

    Animated.spring(emailFocusAnimation, {
      toValue: field === 'email' ? 1.05 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

    Animated.spring(passwordFocusAnimation, {
      toValue: field === 'password' ? 1.05 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

    Animated.spring(confirmFocusAnimation, {
      toValue: field === 'confirmPassword' ? 1.05 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = (field) => {
    if (focusedField === field) {
      setFocusedField(null);
    }

    Animated.spring(emailFocusAnimation, {
      toValue: focusedField === 'email' ? 1.05 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

    Animated.spring(passwordFocusAnimation, {
      toValue: focusedField === 'password' ? 1.05 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

    Animated.spring(confirmFocusAnimation, {
      toValue: focusedField === 'confirmPassword' ? 1.05 : 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleRegister = (values) => {
    const { email, password } = values;
    
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Account registered successfully!');
        navigation.replace('Main');
      })
      .catch((error) => {
        Alert.alert('Registration failed', error.message);
      });
  };

  return (
    <LinearGradient colors={['#007EA7', '#82C0CC', '#00A5CF']} style={styles.registerContainer}>
      <RNStatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.innerContainer}>
        <Text style={styles.pageTitle}>Register</Text>
        <Text style={styles.subTitle}>Please sign up to continue.</Text>

        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.styledFormArea}>
              <CustomTextInput
                icon="mail"
                placeholder="Email"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('email')}
                onBlur={() => handleBlur('email')}
                onFocus={() => handleFocus('email')}
                value={values.email}
                keyboardType="email-address"
                error={touched.email && errors.email}
                focusAnimation={emailFocusAnimation}
              />

              <CustomTextInput
                icon="lock"
                placeholder="Password"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('password')}
                onBlur={() => handleBlur('password')}
                onFocus={() => handleFocus('password')}
                value={values.password}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
                error={touched.password && errors.password}
                focusAnimation={passwordFocusAnimation}
              />

              <CustomTextInput
                icon="lock"
                placeholder="Confirm Password"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('confirmPassword')}
                onBlur={() => handleBlur('confirmPassword')}
                onFocus={() => handleFocus('confirmPassword')}
                value={values.confirmPassword}
                secureTextEntry={hideConfirmPassword}
                isPassword={true}
                hidePassword={hideConfirmPassword}
                setHidePassword={setHideConfirmPassword}
                error={touched.confirmPassword && errors.confirmPassword}
                focusAnimation={confirmFocusAnimation}
              />

              <TouchableOpacity style={styles.styledButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>

              <View style={styles.extraView}>
                <Text style={styles.extraText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.textLink}>
                  <Text style={styles.textLinkContent}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </LinearGradient>
  );
};

const CustomTextInput = ({ icon, isPassword, hidePassword, setHidePassword, error, focusAnimation, onFocus, onBlur, ...props }) => {
  return (
    <Animated.View style={{ transform: [{ scale: focusAnimation }], marginBottom: 15 }}>
      <View style={styles.textInputContainer}>
        <View style={styles.leftIcon}>
          <Octicons name={icon} size={30} color={Colors.black} />
        </View>
        <TextInput
          {...props}
          style={styles.styledTextInput}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {isPassword && (
          <TouchableOpacity style={styles.rightIcon} onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={30} color={darkLight} />
          </TouchableOpacity>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    flex: 1,
    padding: 25,
    paddingTop: 70,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  pageTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#034078',
    marginTop: 60,
  },
  subTitle: {
    fontSize: 16,
    color: '#00072D',
    marginBottom: 40,
  },
  styledFormArea: {
    width: '100%',
  },
  styledTextInput: {
    backgroundColor: secondary,
    padding: 15,
    paddingLeft: 55,
    paddingRight: 55,
    borderRadius: 10,
    fontSize: 16,
    color: tertiary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  styledButton: {
    backgroundColor: '#166088',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  buttonText: {
    color: primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  extraView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  extraText: {
    color: darkLight,
    fontSize: 16,
  },
  textLink: {
    fontSize: 16,
  },
  textLinkContent: {
    color: '#036F71',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#F43F5E',
    fontSize: 12,
    marginTop: 5,
  },
});

export default Register;
