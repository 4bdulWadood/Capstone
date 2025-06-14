import React, { useState } from 'react';
import { View, Text, TouchableOpacity,Platform, Image, TextInput, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import BottomTabNavigator from './BottomTabNavigator';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import colors from './colors';  // Assuming colors.js is in the same directory


const LoginScreen = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const url = 'https://capstone-cmml.onrender.com'
  // const url = 'http://localhost:3001'; // Define your API URL here
  
  const handleLogin = async () => {
    try {
      const loginData = { employeeId, password };

     // const response = await axios.post('http://18.216.105.223:3001/auth/login', loginData);
     const response = await axios.post('http://localhost:3001/auth/login', loginData);

      //const response = await axios.post(`${url}/auth/login`, loginData);

      if (employeeId === 'admin' && password === 'admin') {
        navigation.navigate('Account', { employeeID: employeeId });
        setIsAdmin(true);
      }

      console.log(response);
      console.log('Login successful:', response.data);
      setLoggedIn(true);
      
      // Extracting employeeId and employeeName directly from response.data
      const { id, name: employeeName, pic: employeePic } = response.data;

      // Logging the extracted values
      console.log('Employee ID:', id);
      console.log('Employee Name:', employeeName);
 
      // Navigating to BottomTabNav with employeeId and employeeName as parameters
      navigation.navigate('BottomTabNav', { employeeId: id, employeeName: employeeName, employeePic: employeePic });

    } catch (error) {
      console.error('Error logging in:', error);
      setError('Incorrect user information. Please try again.');
    }
  };

  


  return (
    <View style={styles.container}>
      <Image
        source={require('./images/desk-synergy1.png')} // Adjust the path based on your project structure
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome, Glad to see you!</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmployeeId}
        value={employeeId}
        placeholder="EMP ID"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
      />
      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.registerText}>
        Don't have an account?{' '}
        <Text onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
          Sign Up Now
        </Text>
      </Text>
      {error !== '' && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};


// Determine the background style based on the platform
const backgroundStyle = Platform.select({
  web: {
    backgroundImage: 'linear-gradient(180deg, #94B3FD 0%, #B983FF 100%)',
  },
  default: {},
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    // This background should be set only if Platform.OS === 'web'
    ...backgroundStyle,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    padding: 16,
    marginBottom: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 16,
  },
  loginButton: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    fontSize: 18,
    color: '#8E2DE2', // Adjusted to match your gradient colors
    fontWeight: 'bold',
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
  },
  registerLink: {
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
export default LoginScreen;
