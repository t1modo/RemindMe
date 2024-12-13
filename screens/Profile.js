import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signOut } from 'firebase/auth';

// Get device dimensions
const { width, height } = Dimensions.get('window');

const Profile = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setEmail(currentUser.email);
    } else {
      setEmail('Not Logged In');
    }
  }, []);

  const confirmLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: handleLogout }
      ]
    );
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigation.replace('Start');
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#40916c', '#52b788', '#74c69d']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <Text style={styles.header}>User Profile</Text>

        <View style={styles.contentContainer}>
          <View style={styles.emailContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.email}>{email}</Text>
          </View>

          <TouchableOpacity
            style={styles.changePasswordButton}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={confirmLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
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
    marginTop: height * 0.04,
    marginBottom: height * 0.04,
  },
  contentContainer: {
    backgroundColor: '#ffffff20',
    padding: width * 0.05,
    borderRadius: 10,
    marginBottom: height * 0.03,
  },
  emailContainer: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.045,
    color: '#fff',
  },
  email: {
    fontSize: width * 0.04,
    color: '#fff',
  },
  changePasswordButton: {
    backgroundColor: '#40916c',
    padding: height * 0.02,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    padding: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});

export default Profile;
