import React, { useState, Alert } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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
      <Button title="Send Notification" onPress={handleAddNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#3498db',
    borderBottomWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
});

export default AddNotification;
