import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const Start = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('./../assets/background.jpg')} 
      style={styles.background}
    >
      <View style={styles.headerContainer}>
        <MaskedView
          maskElement={
            <Text style={styles.headerText}>
              RemindMe
            </Text>
          }
          style={styles.maskedView}
        >
          <LinearGradient
            colors={['#FF9E00', '#FF6D00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </MaskedView>
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
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
  },
  maskedView: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    height: 50,
    width: 200,
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
