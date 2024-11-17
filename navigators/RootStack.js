import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../components/AuthContext';

// Import screens
import Start from '../screens/Start';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Main from '../navigators/Main';
import Tasks from '../screens/Tasks';

const Stack = createStackNavigator();

const RootStack = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={user ? 'Main' : 'Start'} // Set default screen based on auth status
    >
      {/* Authenticated User Screens */}
      {user ? (
        <>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Tasks" component={Tasks} />
        </>
      ) : (
        <>
          {/* Unauthenticated User Screens */}
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootStack;
