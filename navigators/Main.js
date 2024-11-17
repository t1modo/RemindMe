import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

// Import Screens
import Profile from './../screens/Profile';
import Tasks from './../screens/Tasks';
import Logs from './../screens/Logs';

const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName="Tasks"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Tasks') {
            iconName = 'folder';
          } else if (route.name === 'Logs') {
            iconName = 'bell';
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#b7e4c7',
        tabBarStyle: {
          backgroundColor: '#40916C',
          borderTopWidth: 3,
          borderTopColor: '#40916C',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Tasks" component={Tasks} />
      <Tab.Screen name="Logs" component={Logs} />
    </Tab.Navigator>
  );
};

export default Main;
