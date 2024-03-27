import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Picker,
  Button,
  ScrollView,
} from 'react-native';
import axios from 'axios';

const BookRoomPage = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [notification, setNotification] = useState({ visible: false, message: '', theme: 'light' });

  const showNotification = (message, theme = 'light') => {
    setNotification({ visible: true, message, theme });
    setTimeout(() => {
      setNotification({ visible: false, message: '', theme: 'light' });
    }, 3000); // hide after 3 seconds
  };

  const onRoomClick = (roomId) => {
    console.log('room clicked');
    var roomName = document.getElementById(roomId).getAttribute('data-room');
    setSelectedRoom(roomName);
    setModalVisible(true);
  };

  // method to check if room is available or not
  const fetchRoomData = async (room, time) => {
    try {
      const response = await axios.get(`http://localhost:3001/auth/rooms/${room}/times/${time}`);
      console.log(response.data);

      // Return the relevant data, e.g., response.data.booked
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${room} data:`, error);
      // Handle error appropriately
      return false; // Return false in case of an error
    }
  };

  const attachRoomClickListeners = () => {
    const rooms = [
      'meeting-room-1',
      'meeting-room-2',
      'conference-room',
      'cafeteria',
      'meeting-room-3',
      'meeting-room-4',
      'open-workspace',
      'meeting-room-5',
      'meeting-room-6',
      'meeting-room-7',
    ];

    rooms.forEach((roomId) => {
      const roomElement = document.getElementById(roomId);
      roomElement.addEventListener('click', () => onRoomClick(roomId));
    });
  };

  useEffect(() => {
    attachRoomClickListeners();
  }, []);

  const handleConfirmBooking = async (room, time) => {
    try {
      const { booked } = await fetchRoomData(room, time);

      if (booked) {
        console.log('Room is available for booking at this time');
        setModalVisible(false);
        await updateBookingStatus(room, time, false);
        showNotification(`You have successfully booked ${room} for ${time}!`, 'green');

        // Set a timeout to revert booking status after 1 minute
        setTimeout(async () => {
        await updateBookingStatus(room, time, true); // Revert to available
        console.log(`Booking status reverted for ${room} at ${time}`);
      }, 60000); // 60000 milliseconds = 1 minute


      } else {
        console.log('Not available for this time');
        setModalVisible(false);
        showNotification(`Booking UnSuccessful for ${room} at ${time}. Please book another timeslot!`, 'red');
        Alert.alert(
          'Booking UnSuccessful',
          'Room is not available for booking at this time.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Error handling booking:', error);
      showNotification('An error occurred while processing your booking. Please try again.', 'red');
    }
  };

 // Update to include a 'booked' parameter to control booking status
const updateBookingStatus = async (room, time, booked) => {
  try {
    // Update the request to reflect the desired status based on the 'booked' parameter
    await axios.put(`http://localhost:3001/auth/rooms/${room}/times/${time}`, { booked });
  } catch (error) {
    console.error(`Error updating booking status for ${room} at ${time}:`, error);
  }
};
  return (
    <ScrollView
      style={{ flex: 1 }}
      horizontal={true}
      contentContainerStyle={styles.contentContainerStyle}
    >
      <View style={styles.svgContainer}>
        {/* SVG floor plan */}
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="780" height="580" fill="lightgrey" stroke="black" stroke-width="2"/>


<rect id="meeting-room-1" data-room="Meeting Room 1" x="20" y="20" width="150" height="100" fill="lightblue" stroke="black" stroke-width="1"/>
<text x="30" y="70" font-family="Verdana" font-size="15" fill="black">Meeting Room 1</text>

<rect id="meeting-room-2" data-room="Meeting Room 2" x="20" y="130" width="150" height="100" fill="lightblue" stroke="black" stroke-width="1"/>
<text x="30" y="180" font-family="Verdana" font-size="15" fill="black">Meeting Room 2</text>

<rect id="conference-room" data-room="Conference Room" x="180" y="20" width="250" height="150" fill="lightgreen" stroke="black" stroke-width="1"/>
<text x="190" y="95" font-family="Verdana" font-size="15" fill="black">Conference Room</text>

<rect id="cafeteria" data-room="Cafeteria" x="450" y="20" width="150" height="100" fill="peachpuff" stroke="black" stroke-width="1"/>
<text x="460" y="70" font-family="Verdana" font-size="15" fill="black">Cafeteria</text>

<rect id="meeting-room-3" data-room="Meeting Room 3" x="620" y="20" width="150" height="100" fill="lightcoral" stroke="black" stroke-width="1"/>
<text x="630" y="70" font-family="Verdana" font-size="15" fill="black">Meeting Room 3</text>

<rect id="meeting-room-4" data-room="Meeting Room 4" x="620" y="130" width="150" height="100" fill="lightcoral" stroke="black" stroke-width="1"/>
<text x="630" y="180" font-family="Verdana" font-size="15" fill="black">Meeting Room 4</text>

<rect id="open-workspace" data-room="Open Workspace" x="180" y="200" width="400" height="150" fill="khaki" stroke="black" stroke-width="1"/>
<text x="190" y="275" font-family="Verdana" font-size="15" fill="black">Open Workspace</text>

<rect id="meeting-room-5" data-room="Meeting Room 5" x="20" y="450" width="150" height="100" fill="lightcoral" stroke="black" stroke-width="1"/>
<text x="30" y="490" font-family="Verdana" font-size="15" fill="black">Meeting Room 5</text>

<rect id="meeting-room-6" data-room="Meeting Room 6" x="200" y="450" width="150" height="100" fill="lightcoral" stroke="black" stroke-width="1"/>
<text x="210" y="490" font-family="Verdana" font-size="15" fill="black">Meeting Room 6</text>

<rect id="meeting-room-7" data-room="Meeting Room 7" x="380" y="450" width="150" height="100" fill="lightcoral" stroke="black" stroke-width="1"/>
<text x="390" y="490" font-family="Verdana" font-size="15" fill="black">Meeting Room 7</text>
        </svg>


        {/* Modal for Booking */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Room Name: {selectedRoom}</Text>
            <Text>Select Time:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedTime}
                onValueChange={(itemValue) => setSelectedTime(itemValue)}
                style={styles.pickerStyle}
              >
                 <Picker.Item label="9:00 AM - 10:00 AM" value="9:00 AM - 10:00 AM" />
                <Picker.Item label="10:00 AM - 11:00 AM" value="10:00 AM - 11:00 AM" />
                <Picker.Item label="11:00 AM - 12:00 PM" value="11:00 AM - 12:00 PM" />
                <Picker.Item label="12:00 PM - 1:00 PM" value="12:00 PM - 1:00 PM" />
                <Picker.Item label="1:00 PM - 2:00 PM" value="1:00 PM - 2:00 PM" />
                <Picker.Item label="2:00 PM - 3:00 PM" value="2:00 PM - 3:00 PM" />
                <Picker.Item label="3:00 PM - 4:00 PM" value="3:00 PM - 4:00 PM" />
                <Picker.Item label="4:00 PM - 5:00 PM" value="4:00 PM - 5:00 PM" />
            
              </Picker>
            </View>
            <Button title="Confirm Booking" onPress={() => handleConfirmBooking(selectedRoom, selectedTime)} />
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    width: 800, // Width of your SVG
    height: 600, // Height of your SVG
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Add other styles here as previously defined
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 10,
  },
  pickerStyle: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 10,
    paddingRight: 10,
  },
  selectedRoomContainer: {
    marginTop: 16,
  },
  selectedRoomText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  button: {
    marginTop: 8,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
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
  closeButton: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default BookRoomPage;