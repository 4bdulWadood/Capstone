// Import the necessary modules
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddNotification from './AddNotification';
import { useNavigation } from '@react-navigation/native';

// Define the NotificationBar component
const NotificationBar = ({ route }) => {
  const [notifications, setNotifications] = useState([]);
  const { employeeId } = route.params;
  const navigation = useNavigation();
  const url = 'https://capstone-cmml.onrender.com'
  // const url = 'http://localhost:3001'

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${url}/auth/notifications?employeeID=${employeeId}`);
      setNotifications(response.data); // Update notifications state with fetched data
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // useEffect hook to fetch notifications when component mounts or employeeId changes
  useEffect(() => {
    fetchNotifications();
  }, [employeeId]);

  // Function to mark a notification as read
  const markAsRead = async (notificationTitle) => {
    try {
      await axios.patch(`${url}/auth/notifications/read?title=${notificationTitle}&employeeID=${employeeId}`);
      // Immediately reflect the change in the UI
      setNotifications(notifications.map(n =>
        n.title === notificationTitle && !n.readBy.includes(employeeId)
          ? { ...n, readBy: [...n.readBy, employeeId] }
          : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Function to delete a notification
  const deleteNotification = async (notificationTitle) => {
    try {
      await axios.delete(`${url}/auth/notifications/delete?title=${notificationTitle}`);
      // Immediately reflect the change in the UI
      setNotifications(notifications.filter(n => n.title !== notificationTitle));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Notifications</Text>
      
      {/* Refresh Button */}
      {/* <TouchableOpacity onPress={fetchNotifications} style={styles.refreshButton}>
        <Icon name="refresh" size={20} color="#3498db" />
      </TouchableOpacity> */}
      
      {/* Add Notification Button */}
      {/* <TouchableOpacity onPress={() => navigation.navigate('AddNotification')} style={styles.addNotificationButton}>
        <Icon name="add-alert" size={30} color="#3498db" />
      </TouchableOpacity> */}

      <TouchableOpacity onPress={fetchNotifications} style={styles.refreshButton}>
    <Icon name="refresh" size={24} color="#a832ff" />
  </TouchableOpacity>

  <TouchableOpacity onPress={() => navigation.navigate('AddNotification')} style={styles.addNotificationButton}>
    <Icon name="add-alert" size={30} color="#a832ff" /> 
  </TouchableOpacity>
      
      {/* Render notifications */}
      {notifications.map((notification, index) => (
        <View key={index} style={[styles.card, notification.readBy.includes(employeeId) ? styles.cardRead : styles.cardUnread]}>
          {/* Title and Delete Button */}
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>{notification.title}</Text>
            <TouchableOpacity onPress={() => deleteNotification(notification.title)} style={styles.deleteButton}>
              <Icon name="delete" size={24} color="#f00" />
            </TouchableOpacity>
          </View>
          
          {/* Message and Time */}
          <Text style={styles.cardMessage}>{notification.message}</Text>
          <Text style={styles.cardTime}>{new Date(notification.createdAt).toLocaleString()}</Text>
          
          {/* Mark as Read Button */}
          <TouchableOpacity onPress={() => markAsRead(notification.title)} style={styles.markAsReadButton}>
            <Text style={styles.markAsReadButtonText}>Mark as Read</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardUnread: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardMessage: {
    fontSize: 14,
  },
  cardTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  // markAsReadButton: {
  //   marginTop: 10,
  //   backgroundColor: '#4CAF50',
  //   padding: 10,
  //   borderRadius: 5,
  // },
  // markAsReadButtonText: {
  //   color: '#fff',
  //   textAlign: 'center',
  // },
  // cardRead: {
  //   opacity: 0.5, // Or use backgroundColor to dim the card
  // },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // This spreads out the title and the delete button on both ends
    alignItems: 'center', // This centers them vertically in case they have different heights
    width: '100%', // Ensure the row takes up the full width of the card
  },
  deleteButton: {
    // You might want to adjust padding or margin based on your layout needs
    padding: 5,
    marginLeft: 10, // Add some space between the title and the button if needed
  },
  refreshButton: {
    alignSelf: 'flex-end',
    marginTop: -30,
    marginRight: 50,
  },
  addNotificationButton: {
    alignSelf: 'flex-end',
    marginTop: -30,
    marginRight: 10,
    marginBottom: 5,
  },
  cardRead: {
    backgroundColor: '#fff', // Keep background color white for consistency
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(163, 159, 159, 0.5)', // Grey border with lower opacity
    borderStyle: 'dashed', // Style the border as dashed or solid based on your preference,
    opacity: 0.5
  },
  markAsReadButton: {
    marginTop: 10,
    backgroundColor: '#a832ff', // Update the button color to purple to match the theme
    padding: 10,
    borderRadius: 20,
  },
  markAsReadButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default NotificationBar;