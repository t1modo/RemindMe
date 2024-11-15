import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>
      <Text style={styles.text}>This is your profile screen. Here, you can manage your account settings, view activity, etc.</Text>

      {/* Example logout button */}
      <Button 
        title="Logout"
        onPress={() => {
          // Handle logout functionality here
          navigation.replace('Start');  // Navigate back to the Start screen
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Profile;
