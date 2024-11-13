import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import RootStack from './navigators/RootStack';

export default function App() {
    return (
        <NavigationContainer>
            <RootStack />
        </NavigationContainer>
    );
}