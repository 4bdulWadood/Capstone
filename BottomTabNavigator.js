import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PMPage from './PMPage';
import BookRoomPage from './BookRoomPage';
import AccountPage from './AccountPage';
import TemperaturesPage from './TemperaturesPage'; // Import TemperaturesPage

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ route }) => {
  const { employeeId, employeeName, employeePic } = route.params;

  console.log("Employee pic:", employeePic);

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#3498db',
        inactiveTintColor: 'gray',
        labelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        style: {
          backgroundColor: '#f2f2f2',
        },
      }}
    >
      <Tab.Screen
        name="PM Tracking"
        component={PMPage}
        initialParams={{ employeeId: employeeId, employeeName: employeeName }}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="track-changes" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Book a Room"
        component={BookRoomPage}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="event-available" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Temperatures" // New screen name for TemperaturesPage
        component={TemperaturesPage} // Link to TemperaturesPage component
        initialParams={{employeeId: employeeId}}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="thermostat" size={size} color={color} />, // Example icon
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountPage}
        initialParams={{ employeeName: employeeName, employeePic: employeePic }}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="account-circle" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
