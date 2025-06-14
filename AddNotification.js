import React, { useState, Alert } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import NotificationBar from './NotificationBar';

const AddNotification = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [time, setTime] = useState('');
  const [employees, setEmployees] = useState('');
  const navigation = useNavigation();
  const url = 'https://capstone-cmml.onrender.com'
  // const url = 'http://localhost:3001'

  const handleAddNotification = async () => {
   
    if (!title || !message || !employees || !time) {
      Alert.alert('Fields cannot be empty');
      return;
    }

    try {
      const teamArray = employees.split(',').map(item => item.trim());
      const notificationData = {
        title,
        message,
        targetEmployeeIds: teamArray,
        createdAt: time,
      };

      await axios.post(`${url}/auth/addnotifications`, notificationData);
      console.log('Notification sent successfully!')
      navigation.navigate('NotificationBar')
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Notification</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
      />
      <TextInput
        style={styles.input}
        placeholder="Target Employee ID's (Comma-separated)"
        value={employees}
        onChangeText={setEmployees}
      />
      <TextInput
        style={styles.input}
        placeholder="Created At (mm/dd/yyyy)"
        value={time}
        onChangeText={setTime}
      />
<TouchableOpacity style={styles.button} onPress={handleAddNotification}>
  <Text style={styles.buttonText}>Send Notification</Text>
</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Aligns form to the top of the screen
    alignItems: 'stretch', // Stretches the items to the sides
    paddingTop: 50, // Adds space at the top
    paddingHorizontal: 20, // Adds horizontal padding
    // backgroundColor: '#F0EBE3', // Matches the background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Dark text color for contrast
  },
  input: {
    height: 50, // Increases the height for better touch area
    width: '100%', // Ensures input stretches to the full width
    backgroundColor: '#fff', // White background for the input
    borderColor: '#B9C6AE', // Border color to match the theme
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 20, // Adds left padding inside the input
    borderRadius: 25, // Rounds the corners
    fontSize: 16, // Increases font size
    color: '#333', // Dark text color for contrast
  },
  button: {
    backgroundColor: '#a832ff', // Purple button to match the accent color in the app
    borderRadius: 35, // Rounds the corners
    height: 50, // Sets a fixed height for consistency
    justifyContent: 'center', // Centers the button text vertically
    alignItems: 'center', // Centers the button text horizontally
    elevation: 3, // Adds a subtle shadow on Android
    marginTop: 16, // Adds margin to the top
  },
  
  buttonText: {
    color: '#fff', // White text color
    fontSize: 18, // Increases font size
    fontWeight: 'bold', // Makes the text bold
  },

});



export default AddNotification;
