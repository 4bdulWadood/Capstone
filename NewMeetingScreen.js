import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';
import { useNavigation } from '@react-navigation/native'; // Make sure to import useNavigation
import axios from 'axios';


const NewMeetingScreen = ({route}) => {
  const [meetingName, setMeetingName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [room, setRoom] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [notification, setNotification] = useState({ visible: false, message: '', theme: 'light' });

  const API_URL = 'https://capstone-cmml.onrender.com';
  // const API_URL = 'http://localhost:3001';

  const timeSlots = [
    '09:00AM', '10:00AM', '11:00AM',
    '12:00PM', '1:00PM', '2:00PM',
    '3:00PM', '4:00PM', '5:00PM',
  ];


  const { roomData } = route.params;
  const navigation = useNavigation(); // Use the useNavigation hook to get access to navigation

  const TimeSlotButton = ({ time, onPress, isSelected, isBooked }) => (
    <TouchableOpacity
    onPress={onPress}
    style={[
      styles.timeSlot,
      isSelected ? styles.selectedTimeSlot : null,
      isBooked && !isSelected ? styles.bookedTimeSlot : null,
    ]}
    disabled={isBooked}
  >
    <Text style={isSelected ? styles.timeSlotTextSelected : styles.timeSlotText}>
      {time}
    </Text>
  </TouchableOpacity>
  );

  const handleTimeSlotPress = (time) => {
    console.log('time', time)
    setSelectedTimeSlot(time);
    const [hoursStr, minutesStr, period] = time.match(/\d+|\D+/g);
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const newStartTime = new Date(date.setHours(hours, minutes));
    setStartTime(newStartTime);
    // console.log('new start time', newStartTime)
  };

  const handleConfirmBooking = async (roomType, time) => {
    try {
      // console.log('time in the handleconfirm method', time)
      // You need to fetch the specific room data by roomType or other identifiers
      // const timeSlot = roomData.times.find(slot => slot.startTime === time && !slot.booked);
      const availablity = roomData.times.find(slot => slot.startTime === time)?.booked || false;

      // console.log('boolean value for time',time, timeSlotBookedStatus)
  
      if (!availablity) { // if availablity is false -> room available for booking
        console.log('Room is available for booking at this time');
        await updateBookingStatus(roomType, time, true);
        showNotification(`You have successfully booked ${roomType} for ${time}!`, 'green');
      } else { // if true -> not available to be booked
        console.log('Not available for this time');
        showNotification(`Booking unsuccessful for ${roomType} at ${time}. Please book another timeslot!`, 'red');
      }
    } catch (error) {
      console.error('Error handling booking:', error);
      showNotification('An error occurred while processing your booking. Please try again.', 'red');
    }
  };

  
  // Update the booking status in your backend
  const updateBookingStatus = async (roomType, time, bookedStatus) => {
    try {
      console.log('in the updatebookingstatus method', roomType, time,bookedStatus)
      // Find the room and time slot you want to update
      const response = await axios.put(`${API_URL}/auth/rooms/updateBooking`, {
        type: roomType,
        startTime: time,
        booked: bookedStatus
      });
  
      // Handle the response as needed
      if (response.status === 200) {
        console.log('Booking status updated successfully');
      } else {
        console.log('Failed to update booking status');
      }
    } catch (error) {
      console.error(`Error updating booking status for ${roomType} at ${time}:`, error);
    }
  };

  const showNotification = (message, theme = 'light') => {
    setNotification({ visible: true, message, theme });
    setTimeout(() => {
      setNotification({ visible: false, message: '', theme: 'light' });
    }, 7000); // hide after 3 seconds
  };

  const confirmBooking = async () => {
    if (!selectedTimeSlot) {
      showNotification('Please select a time slot.', 'red');
      return;
    }
    // This should trigger your API endpoint to update the booking status
    handleConfirmBooking(roomData.type, selectedTimeSlot);
  };

  return (
    <ScrollView style={styles.container}>
      {notification.visible && (
      <View style={[styles.notification, { backgroundColor: notification.theme === 'red' ? '#FFCCCC' : '#CCFFCC' }]}>
        <Text style={styles.notificationText}>{notification.message}</Text>
        <TouchableOpacity onPress={() => setNotification({ visible: false, message: '', theme: 'light' })}>
          <Text style={styles.closeButton}>X</Text>
        </TouchableOpacity>
      </View>
    )}
      <Text style={styles.header}>New Meeting</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Start Time</Text>
        <View style={styles.timeSlotsContainer}>
          {timeSlots.map((time) => {
            // Check if the current time slot is booked
            const isBooked = roomData.times.some(slot => slot.startTime === time && slot.booked);
            return (
              <TimeSlotButton
                key={time}
                time={time}
                onPress={() => handleTimeSlotPress(time)}
                isSelected={selectedTimeSlot === time}
                isBooked={isBooked} // pass whether the time slot is booked
              />
            );
          })}
        </View>

        {/* Meeting Title and Description Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Meeting Title"
          value={meetingName}
          onChangeText={setMeetingName}
        />

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Create Button */}
        <TouchableOpacity style={styles.createButton} onPress={confirmBooking}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  createButton: {
    backgroundColor: '#a832ff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
    // The rest of your inputGroup styles
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    // Add any additional styling for the container of the time slots
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 15,
    // Add any additional styling for text input
  },
  descriptionInput: {
    height: 100, // Set height for the description field
    textAlignVertical: 'top', // Align text to the top for multiline input
  },
  timeSlot: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 5,
    backgroundColor: 'white', // Default background
    width: '30%', // Approximate width to fit three across on most screens
  },
  selectedTimeSlot: {
    backgroundColor: '#a832ff', // Highlight color for selected time slot
    borderColor: 'transparent',
  },
  timeSlotTextSelected: {
    textAlign: 'center',
    color: 'white',
  },
  timeSlotText: {
    textAlign: 'center',
    color: '#333',
  },
  notification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 1000,
  },
  notificationText: {
    color: '#000',
  },
  bookedTimeSlot: {
    backgroundColor: '#e0e0e0', // a grey background to indicate it's not available
    borderColor: '#bdbdbd', // darker border color for booked time slot
    opacity: 0.5, // make the button semi-transparent
  },
});

export default NewMeetingScreen;
