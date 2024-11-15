import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Import Screens
import Tasks from './../screens/Tasks';
import Logs from './../screens/Logs';

const Tab = createBottomTabNavigator();

const RootStack = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            
            {/* Set the background using LinearGradient */}
            <LinearGradient
                colors={['#40916c', '#40916c']}
                style={styles.rootBackground}
            >
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
                        tabBarActiveTintColor: '#ffffff',
                        tabBarInactiveTintColor: '#b7e4c7',
                        tabBarStyle: {
                            backgroundColor: '#40916C',  // Explicitly set background color for the tab bar
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
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    rootBackground: {
        flex: 1,
    },
});

export default RootStack;
