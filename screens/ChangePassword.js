import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons'; // Import the eye icon

// Get device dimensions
const { width, height } = Dimensions.get('window');

const ChangePassword = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for toggling visibility of passwords
  const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);

        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { passwordLastUpdated: new Date() });

        Alert.alert('Success', 'Your password has been changed successfully.');
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'User is not logged in.');
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#40916c', '#52b788', '#74c69d']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Change Password</Text>

        {/* Current Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry={hideCurrentPassword}
            onChangeText={setCurrentPassword}
            value={currentPassword}
          />
          <TouchableOpacity 
            onPress={() => setHideCurrentPassword(!hideCurrentPassword)} 
            style={styles.eyeIconContainer}
          >
            <MaterialIcons 
              name={hideCurrentPassword ? 'visibility-off' : 'visibility'} 
              size={30} 
              color="#9CA3AF" 
            />
          </TouchableOpacity>
        </View>

        {/* New Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry={hideNewPassword}
            onChangeText={setNewPassword}
            value={newPassword}
          />
          <TouchableOpacity 
            onPress={() => setHideNewPassword(!hideNewPassword)} 
            style={styles.eyeIconContainer}
          >
            <MaterialIcons 
              name={hideNewPassword ? 'visibility-off' : 'visibility'} 
              size={30} 
              color="#9CA3AF" 
            />
          </TouchableOpacity>
        </View>

        {/* Confirm New Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry={hideConfirmPassword}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <TouchableOpacity 
            onPress={() => setHideConfirmPassword(!hideConfirmPassword)} 
            style={styles.eyeIconContainer}
          >
            <MaterialIcons 
              name={hideConfirmPassword ? 'visibility-off' : 'visibility'} 
              size={30} 
              color="#9CA3AF" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.changePasswordButton, loading && styles.disabledButton]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Change Password'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.05,
  },
  header: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingTop: 35,
    marginBottom: height * 0.04,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: height * 0.065, // Larger container height
    marginBottom: height * 0.03,
  },
  input: {
    flex: 1,
    fontSize: width * 0.05, // Larger font size
    height: '100%',
  },
  eyeIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    
  },
  changePasswordButton: {
    backgroundColor: '#40916c',
    padding: height * 0.02,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    width: '60%',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#40916c',
    marginTop: height * 0.02,
    padding: height * 0.02,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    width: '60%',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default ChangePassword;
