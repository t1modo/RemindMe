import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../components/AuthContext';

// Import screens
import Start from '../screens/Start';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Main from '../navigators/Main';
import ChangePassword from '../screens/ChangePassword'; // Import ChangePassword

const Stack = createStackNavigator();

const RootStack = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={user ? 'Main' : 'Start'}
    >
      {user ? (
        <>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} /> 
        </>
      ) : (
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
