import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './components/AuthContext';
import RootStack from './navigators/RootStack';
import Loading from './components/Loading.js';

const App = () => {
  return (
    <AuthProvider>
      <NavigationWrapper />
    </AuthProvider>
  );
};

const NavigationWrapper = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading size={50} stroke={4} speed={1} color="#40916C" />;
  }

  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default App;
