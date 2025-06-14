// RoomScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NewMeetingScreen from './NewMeetingScreen';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import BottomTabNavigator from './BottomTabNavigator';
import axios from 'axios';
import { useState, useEffect } from 'react';


const RoomCard = ({ room, onBook }) => (
  <View style={styles.roomCard}>
    <Image source={{ uri: room.image }} style={styles.image} />
    <View style={styles.roomDetails}>
      <Text style={styles.roomTitle}>{room.type}</Text>
      <Text style={styles.roomSubtitle}>{room.location}</Text>
      <View style={styles.roomInfo}>
        <Icon name="people" size={16} style={styles.infoIcon} />
        <Text style={styles.infoText}>{room.capacity} persons</Text>
      </View>
      <View style={styles.roomInfo}>
        <Icon name="check" size={16} style={styles.infoIcon} />
        <Text style={styles.infoText}>{room.amenities.join(', ')}</Text>
      </View>
    </View>
    <TouchableOpacity onPress={() => onBook(room)} style={styles.bookButton}>
      <Text style={styles.bookButtonText}>Book</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  roomCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
    marginBottom:10,
  },
  roomDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roomSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 8,
    color: '#666',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#a832ff', // This is a blue color, change as needed.
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // ... Add other styles that were previously defined
});

const RoomListScreen = () => {

    const navigation = useNavigation();
    const [roomsData, setRoomsData] = useState([]);
    const API_URL = 'https://capstone-cmml.onrender.com/auth/rooms' // Replace with your actual API URL
    // const API_URL = 'http://localhost:3001/auth/rooms'; // Replace with your actual API URL
  
    useEffect(() => {
      const fetchRoomsData = async () => {
        try {
          const response = await axios.get(API_URL);
    
          setRoomsData(response.data);
        } catch (error) {
          console.error('Failed to fetch rooms:', error);
          // Handle the error, e.g., show a notification or set an error state
        }
      };
  
      fetchRoomsData();
    }, []);
  
  const handleBookRoom = (room) => {
    navigation.navigate('NewMeetingScreen', { roomData: room });
  };
  

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 20 }}>Rooms</Text>
      <FlatList
        data={roomsData}
        renderItem={({ item }) => <RoomCard room={item} onBook={handleBookRoom} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default RoomListScreen;
