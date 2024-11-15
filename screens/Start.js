import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';  // For gradient styling
import { useNavigation } from '@react-navigation/native';

const Start = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}  // Ensure the path is correct for the background image
      style={styles.background}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>RemindMe</Text>
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: 60,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#fff',  // Ensure the text is visible on the background
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  button: {
    backgroundColor: '#166088',
    padding: 20,
    marginBottom: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default Start;