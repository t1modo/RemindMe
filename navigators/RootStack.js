import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from '../screens/Start';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Main from '../navigators/Main';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Start"
      screenOptions={{
        headerShown: false, // Hide header for all screens
      }}
    >
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Main" component={Main} />
    </Stack.Navigator>
  );
};

export default RootStack;
