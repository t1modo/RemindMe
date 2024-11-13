import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {FontAwesome} from '@expo/vector-icons';

//import Screens
import Tasks from './../screens/Tasks';
import Logs from './../screens/Logs';

const Tab = createBottomTabNavigator();

const RootStack = () => {
    return (
        <Tab.Navigator
            initialRouteName="Tasks"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Tasks') {
                        iconName = 'clipboard';
                        return <FontAwesome name={iconName} size={size} color={color} />;
                    } else if (route.name === 'Logs') {
                        iconName = 'bell';
                        return <FontAwesome name={iconName} size={size} color={color} />;
                    }
                },
                tabBarActiveTintColor: '#52B788',
                tabBarInactiveTintColor: '#95D5B2',
                tabBarStyle: {
                    borderTopWidth: 3,
                    borderTopColor: '#52B788',
                },
            })}
        >
            <Tab.Screen name="Tasks" component={Tasks} />
            <Tab.Screen name="Logs" component={Logs} />
        </Tab.Navigator>
    );
}

export default RootStack;