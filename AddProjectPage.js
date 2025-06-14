import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // This is for a modal date picker

const AddProject = () => {
  const [projectName, setProjectName] = useState('');
  // const [percentageComplete, setPercentageComplete] = useState('');
  const [team, setTeam] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: '', theme: 'light' });
  const API_URL = 'https://capstone-cmml.onrender.com';
  // const API_URL = 'http://localhost:3001';

  const showNotification = (message, theme = 'light') => {
    setNotification({ visible: true, message, theme });
    setTimeout(() => {
      setNotification({ visible: false, message: '', theme: 'light' });
    }, 3000); // hide after 3 seconds
  };

  const handleAddProject = async () => {
    if (!projectName || !team || !dueDate) {
      showNotification('TextFields cannot be empty', 'red');
      return;
    }

    try {
      const teamArray = team.split(',').map(item => item.trim());
      const projectData = {
        Name: projectName,
        // Percentage_Complete: parseFloat(percentageComplete),
        Due_Date: dueDate,
        Team: teamArray,
      };

      await axios.post(`${API_URL}/auth/projects`, projectData);
      showNotification('Project successfully added!', 'green');
    } catch (error) {
      showNotification('Project was not added!', 'red');
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    setDueDate(date.toISOString().split('T')[0]); // Save the formatted date
    hideDatePicker();
  };

  const handleDateChange = (event) => {
    setDueDate(event.target.value); // Update due date from the event
    setShowDatePicker(false); // Hide the date picker
  };



return (
  <View style={styles.container}>
    {notification.visible && (
      <View style={[styles.notification, { backgroundColor: notification.theme === 'red' ? '#FFCCCC' : '#CCFFCC' }]}>
        <Text style={styles.notificationText}>{notification.message}</Text>
        <TouchableOpacity onPress={() => setNotification({ visible: false, message: '', theme: 'light' })}>
          <Text style={styles.closeButton}>X</Text>
        </TouchableOpacity>
      </View>
    )}
    <Text style={styles.title}>Add New Project</Text>
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Project Name"
        value={projectName}
        onChangeText={setProjectName}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Percentage Complete"
        keyboardType="numeric"
        value={percentageComplete}
        onChangeText={setPercentageComplete}
      /> */}
      <TextInput
        style={styles.input}
        placeholder="Team (Comma-separated)"
        value={team}
        onChangeText={setTeam}
      />
      <TextInput
        style={styles.input}
        placeholder="Due Date (yyyy-mm-dd)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddProject}>
  <Text style={styles.buttonText}>Add Project</Text>
</TouchableOpacity>
    </View>
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
    borderColor: '#a832ff', // Purple border color to match the theme
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 20, // Adds left padding inside the input
    borderRadius: 25, // Rounds the corners
    fontSize: 16, // Increases font size
    color: '#333', // Dark text color for contrast
  },
  // Add styles for the date picker input if necessary
  // ... other styles
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

inputContainer: {
  width: '100%',
},

datePickerRow: {
  flexDirection: 'row',
  alignItems: 'center',
},
dateInput: {
  flex: 1,
},
calendarButton: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  padding: 10,
  marginLeft: 5,
  backgroundColor: '#e8e8e8', // Slightly darker grey for the button
},
calendarText: {
  fontSize: 16,
},
notification: {
  position: 'absolute',
  top: 10,
  left: 10,
  right: 10,
  padding: 20,
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
  zIndex: 1000,
  borderRadius: 5,
},
notificationText: {
  color: '#000',
},
closeButton: {
  color: '#000',
  fontWeight: 'bold',
},


});

export default AddProject;
