import React, { useState } from 'react';
import {
  StatusBar as RNStatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Colors = {
  primary: '#ffffff',
  secondary: '#E5E7EB',
  tertiary: '#1F2937',
  darkLight: '#9CA3AF',
  green: '#10B981',
  red: '#EF4444',
  black: '#000000',
};

const { darkLight, primary, secondary, tertiary } = Colors;

// Validation schema
const validationSchema = Yup.object().shape({
  email_address: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const navigation = useNavigation();
  const [hidePassword, setHidePassword] = useState(true);
  const [emailFocusAnimation] = useState(new Animated.Value(1));
  const [passwordFocusAnimation] = useState(new Animated.Value(1));

  const handleFocus = (fieldAnimation) => {
    Animated.spring(fieldAnimation, {
      toValue: 1.05,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = (fieldAnimation) => {
    Animated.spring(fieldAnimation, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async (values) => {
    const { email_address, password } = values;
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email_address, password);
      Alert.alert('Success', 'Logged in successfully!');
      // Use navigate instead of reset
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <LinearGradient colors={['#007EA7', '#82C0CC', '#00A5CF']} style={styles.container}>
      <RNStatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Please sign in to continue.</Text>

        <Formik
          initialValues={{ email_address: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formArea}>
              <CustomTextInput
                icon="mail"
                placeholder="Email Address"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('email_address')}
                onBlur={() => handleBlur('email_address')}
                onFocus={() => handleFocus(emailFocusAnimation)}
                value={values.email_address}
                focusAnimation={emailFocusAnimation}
                error={touched.email_address && errors.email_address}
              />
              <CustomTextInput
                icon="lock"
                placeholder="Password"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('password')}
                onBlur={() => handleBlur('password')}
                onFocus={() => handleFocus(passwordFocusAnimation)}
                value={values.password}
                focusAnimation={passwordFocusAnimation}
                isPassword={true}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
                error={touched.password && errors.password}
              />

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.extraView}>
                <Text style={styles.extraText}>Don’t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.linkText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </LinearGradient>
  );
};

const CustomTextInput = ({
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  error,
  focusAnimation,
  ...props
}) => (
  <Animated.View style={{ transform: [{ scale: focusAnimation }], marginBottom: 20 }}>
    <View style={styles.inputContainer}>
      <Octicons name={icon} size={24} color={Colors.black} style={styles.leftIcon} />
      <TextInput
        {...props}
        style={styles.input}
        secureTextEntry={isPassword && hidePassword}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.rightIcon}>
          <MaterialIcons
            name={hidePassword ? 'visibility-off' : 'visibility'}
            size={24}
            color={darkLight}
          />
        </TouchableOpacity>
      )}
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#034078',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#00072D',
    marginBottom: 40,
  },
  formArea: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 60,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: tertiary,
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#166088',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    height: 60,
  },
  buttonText: {
    color: primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  extraView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  extraText: {
    color: tertiary,
    fontSize: 15,
  },
  linkText: {
    color: '#166088',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: Colors.red,
    fontSize: 12,
    marginTop: 5,
  },
});

export default Login;
