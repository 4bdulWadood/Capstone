// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import homepage from './homepage';
import PMPage from './PMPage';
import BottomTabNavigator from './BottomTabNavigator';
import BookRoomPage from './BookRoomPage';
import OnboardingScreen from './OnboardScreen'; // Import the OnboardingScreen component
import AccountPage from './AccountPage';
import AddProject from './AddProjectPage';
import AddNotification from './AddNotification';


const Stack = createStackNavigator();
// const stylesCss = Asset.fromModule(require('./App.css')).uri;

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Home"
          component={homepage}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PMPage"
          component={PMPage}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="BottomTabNav"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="BookRoomPage"
          component={BookRoomPage}
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="AccountPage"
          component={AccountPage} // Use a WebView component for home.html
          options={{ headerShown: true }}
        />

      <Stack.Screen
          name="AddNotification"
          component={AddNotification} // Use a WebView component for home.html
          options={{ headerShown: true }}
        />  
        

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;