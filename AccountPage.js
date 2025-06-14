// AccountPage.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AccountPage = ({ route }) => {
  const navigation = useNavigation();
  const { employeeName, employeePic } = route.params;
  // const API_URL = 'http://localhost:3001'
 const API_URL = 'https://capstone-cmml.onrender.com'
  
  const handleLogout = () => {
    // Logout logic here
    navigation.navigate('Home');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword'); // Navigate to ChangePasswordScreen
  };

  return (
    <View style={[styles.container, backgroundStyle]}>
      <View style={styles.profileHeader}>
      <Image
        source={employeePic ? { uri: employeePic } : require('./images/Ishan-photo1.jpg')}
        style={styles.profilePic}
      />
        <Text style={styles.profileName}>{employeeName}</Text>
        <Text style={styles.profileEmail}>{employeeName}@deskSynergy.com</Text>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
        <Text style={styles.actionText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// Define background style based on the platform
const backgroundStyle = Platform.select({
  web: {
    backgroundImage: 'linear-gradient(180deg, #94B3FD 0%, #B983FF 100%)',
    flex: 1,
    height: '100vh', // Ensures the gradient fills the whole viewport height
  },
  default: {
    flex: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeader: {
    marginBottom: 30,
    alignItems: 'center',
  },
  profilePic: {
    width: 100, // Adjust the size as needed
    height: 100, // Adjust the size as needed
    borderRadius: 50, // Half the size of the width/height to make it circular
    borderWidth: 3, // Adjust the width as needed
    borderColor: '#fff', // Adjust the color as needed
    marginTop: -50, // Adjust this to position your avatar correctly
    backgroundColor: '#e0e0e0', // Placeholder color if no image is provided
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#fff',
  },
  profileEmail: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '80%', // Set a max-width for the buttons
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold'
  },
});

export default AccountPage;
