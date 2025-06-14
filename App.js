import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import homepage from './homepage';
import PMPage from './PMPage';
import BottomTabNavigator from './BottomTabNavigator';
import BookRoomPage from './BookRoomPage';
import OnboardingScreen from './OnboardScreen'; // Import the OnboardingScreen component
import AccountPage from './AccountPage';
import AddProject from './AddProjectPage';
import AddNotification from './AddNotification';
import MeetingRoom from './MeetingRoom';
import NewMeetingScreen from './NewMeetingScreen';
import ChangePasswordScreen from './ChangePasswordScreen'; // Import the ChangePasswordScreen component
import RegisterScreen from './RegisterScreen'; // Import the RegisterScreen component
import LoginScreen from './LoginScreen'; // Import the LoginScreen component


const Stack = createStackNavigator();
// const stylesCss = Asset.fromModule(require('./App.css')).uri;

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
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
          options={{ headerShown: true }}
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
          component={AccountPage}
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="AddNotification"
          component={AddNotification}
          options={{ headerShown: true }}
        />  
        
        <Stack.Screen
          name="NewRoom"
          component={MeetingRoom}
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="NewMeetingScreen"
          component={NewMeetingScreen}
          options={{ headerShown: true }}
        />

        {/* Add the ChangePassword screen to the navigation */}
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ headerShown: true }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
