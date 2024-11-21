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
      setEmail(currentUser.email); // Fetch the user's email
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
            onPress={() => Alert.alert("Change Password", "This will navigate to change password screen.")}
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
    paddingHorizontal: width * 0.05, // 5% of screen width
    paddingVertical: height * 0.05, // 5% of screen height
  },
  header: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: height * 0.04, // 4% of screen height
    marginBottom: height * 0.04, // 4% of screen height
  },
  contentContainer: {
    backgroundColor: '#ffffff20',
    padding: width * 0.05, // 5% of screen width
    borderRadius: 10,
    marginBottom: height * 0.03, // 3% of screen height
  },
  emailContainer: {
    marginBottom: height * 0.02, // 2% of screen height
  },
  label: {
    fontSize: width * 0.045, // 4.5% of screen width
    color: '#fff',
    marginBottom: height * 0.01, // 1% of screen height
    textAlign: 'left',
  },
  email: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#fff',
    marginBottom: height * 0.01, // 1% of screen height
  },
  changePasswordButton: {
    backgroundColor: '#40916c',
    padding: height * 0.02, // 2% of screen height
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    width: '80%',
  },
  logoutButton: {
    position: 'absolute',
    bottom: height * 0.05, // 5% of screen height
    left: width * 0.05, // 5% of screen width
    right: width * 0.05, // 5% of screen width
    backgroundColor: '#d9534f',
    padding: height * 0.02, // 2% of screen height
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045, // 4.5% of screen width
    fontWeight: 'bold',
  },
});

export default Profile;
