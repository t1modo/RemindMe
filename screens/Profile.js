import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, signOut } from 'firebase/auth';

const Profile = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert(
      "Notifications",
      `Notifications have been ${!notificationsEnabled ? "enabled" : "disabled"}.`
    );
  };

  return (
    <LinearGradient
      colors={['#40916c', '#52b788', '#74c69d']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <Text style={styles.header}>User Profile</Text>
        <View style={styles.section}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Alert.alert("Change Password", "This will navigate to change password screen.")}
          >
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={confirmLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Toggle Notifications:</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            thumbColor={notificationsEnabled ? '#2d6a4f' : '#FF4500'}
            trackColor={{ false: '#FF6347', true: '#90EE90' }}
          />
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  section: {
    marginVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#40916c',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
