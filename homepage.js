import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';

const Homepage = ({ navigation }) => {
  const handleLoginClick = () => {
    navigation.navigate('Login');
  };

  const handleRegisterClick = () => {
    navigation.navigate('Register');
  };

  // Style object for container with gradient background
  const containerStyle = Platform.select({
    web: {
      // For web: use backgroundImage with a horizontal gradient
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100%',
      backgroundImage: 'linear-gradient(#94B3FD, #B983FF)',
    },
    default: {
      // For native: use styles.container which will have LinearGradient component
      ...styles.container,
    },
  });

  return (
    <View style={containerStyle}>
      <Image
        source={require('./images/desk-synergy1.png')} // Adjust the path based on your project structure
        style={styles.logo}
      />
      <TouchableOpacity style={styles.button} onPress={handleLoginClick}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRegisterClick}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: Platform.select({
    web: {
      // Web-specific gradient styling
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      height: '100vh', // Take full height of the viewport
      background: 'linear-gradient(to right, #94B3FD, #B983FF)',
    },
    default: {
      // Native uses these styles with LinearGradient component
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
  }),
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  button: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  buttonText: {
    color: '#8E2DE2',
    fontWeight: 'bold',
    fontSize: 20,
  },
  guestText: {
    color: '#ffffff',
    marginTop: 15,
  },
});

export default Homepage;
