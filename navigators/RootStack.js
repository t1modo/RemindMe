import React from "react";
import { StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from '@expo/vector-icons';

// Import Screens
import Tasks from './../screens/Tasks';
import Logs from './../screens/Logs';

const Tab = createBottomTabNavigator();

const RootStack = () => {
    return (
        <>
            {/* Set the status bar text to dark */}
            <StatusBar barStyle="dark-content" />

            <Tab.Navigator
                initialRouteName="Tasks"
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === 'Tasks') {
                            iconName = 'folder';
                        } else if (route.name === 'Logs') {
                            iconName = 'bell';
                        }
                        return <FontAwesome name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#40916C',
                    tabBarInactiveTintColor: '#B7E4C7',
                    tabBarStyle: {
                        borderTopWidth: 3,
                        borderTopColor: '#40916C',
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen 
                    name="Tasks" 
                    component={Tasks} 
                />
                <Tab.Screen 
                    name="Logs" 
                    component={Logs} 
                />
            </Tab.Navigator>
        </>
    );
}

export default RootStack;
