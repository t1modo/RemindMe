import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import RootStack from './navigators/RootStack';

import Start from './screens/Start';

export default function App() {
    return (
        <NavigationContainer>
            <Start />
        </NavigationContainer>
    );
}