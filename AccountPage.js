// AccountPage.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';

const AccountPage = ({ route }) => {
  const navigation = useNavigation();
  const { employeeName, employeePic } = route.params;
  const joinDate = 'January 5, 2020';
  const lastLogin = 'March 28, 2024, 3:42 PM';
  const location = 'New York, USA';

  const handleLogout = () => {
    // Logout logic here
    navigation.navigate('Home');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword'); // Navigate to ChangePasswordScreen
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Image
          size={80}
          source={{ uri: employeePic }}
          style={styles.profilePic}
        />
        <Text style={styles.profileName}>{employeeName}</Text>
        <Text style={styles.profileEmail}>{employeeName}@deskSynergy.com</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
          <Text style={styles.actionText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Text style={styles.actionText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Additional user details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Details</Text>
        <Text style={styles.detailItem}>Join Date: {joinDate}</Text>
        <Text style={styles.detailItem}>Last Login: {lastLogin}</Text>
        <Text style={styles.detailItem}>Location: {location}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light background color
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePic: {
    backgroundColor: '#e0e0e0', // Placeholder background color for profile pic
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333', // Dark text for light background
  },
  profileEmail: {
    fontSize: 16,
    color: '#555', // Dimmed text color
  },
  actionsContainer: {
    backgroundColor: '#ffffff', // Light color for action buttons background
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000', // Shadow to lift the container
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButton: {
    backgroundColor: '#e7e7e7', // White button background for a cleaner look
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Rounded corners for a modern look
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1, // Slight border for definition
    borderColor: '#dddddd', // Light grey border color
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500', // Medium text weight
    color: '#333', // Dark grey text for better readability
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333', // Dark text for light background
  },
  detailItem: {
    fontSize: 16,
    color: '#555', // Dimmed text color
    marginBottom: 4,
  },
});

export default AccountPage;
