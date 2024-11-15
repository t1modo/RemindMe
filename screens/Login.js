import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import * as Yup from 'yup';
import { Formik } from 'formik';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogin = (values) => {
    const { email, password } = values;
    setLoading(true);

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoading(false);
        Alert.alert('Logged in successfully!');
        navigation.replace('Main');  // Navigate to main screen after successful login
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert('Login failed', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
            />
            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
            />
            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Don't have an account? Register</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#166088',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  link: {
    textAlign: 'center',
    color: '#0066CC',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default Login;
