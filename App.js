import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './components/AuthContext';  // Assuming you're using context for auth
import RootStack from './navigators/RootStack';  // Import RootStack

const App = () => {
  return (
    <AuthProvider>
      <NavigationWrapper />
    </AuthProvider>
  );
};

const NavigationWrapper = () => {
  const { isLoggedIn } = useAuth();  // Get login state

  return (
    <NavigationContainer>
      {isLoggedIn ? <RootStack /> : <RootStack />}  {/* Use RootStack for both cases */}
    </NavigationContainer>
  );
};

export default App;
