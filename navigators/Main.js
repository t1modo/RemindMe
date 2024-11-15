import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
            iconName = 'folder';  // Icon for Tasks
          } else if (route.name === 'Logs') {
            iconName = 'bell';    // Icon for Logs
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ffffff',  // Active tab color
        tabBarInactiveTintColor: '#b7e4c7',  // Inactive tab color
        tabBarStyle: {
          backgroundColor: '#40916C',  // Tab bar background color
          borderTopWidth: 3,  // Border between tabs
          borderTopColor: '#40916C',  // Tab border color
        },
        headerShown: false,  // Hide header for each screen
      })}
    >
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Tasks" component={Tasks} />
      <Tab.Screen name="Logs" component={Logs} />
    </Tab.Navigator>
  );
};

export default Main;
