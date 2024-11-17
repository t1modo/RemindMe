import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../components/AuthContext';

// Import screens
import Start from '../screens/Start';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Main from '../navigators/Main';

const Stack = createStackNavigator();

const RootStack = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={user ? 'Main' : 'Start'}
    >
      {user ? (
        // Main navigator for authenticated users
        <Stack.Screen name="Main" component={Main} />
      ) : (
        // Stack for unauthenticated users
        <>
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootStack;
