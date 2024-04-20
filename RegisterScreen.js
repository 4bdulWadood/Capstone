import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, TextInput, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { Button, Card, Title, IconButton } from 'react-native-paper';


const RegisterScreen = ({ navigation }) => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const url = 'https://capstone-cmml.onrender.com'
  const url = 'http://localhost:3001'

  const handleHome = () => {
    navigation.navigate('Home');
  };

  const handleRegister = async () => {
    try {
      const registrationData = { employeeName, employeeId, password };
      const response = await axios.post(`${url}/auth/register`, registrationData);
      console.log('User registered successfully:', response.data);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./images/desk-synergy1.png')} // Adjust the path based on your project structure
        style={styles.logo}
      />
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={employeeName}
        onChangeText={setEmployeeName}
        placeholderTextColor="#6b7280"
      />
      <TextInput
        style={styles.input}
        placeholder="Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
        placeholderTextColor="#6b7280"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#6b7280"
      />
      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.signInText}>
        Already have an account?{' '}
        <Text onPress={() => navigation.navigate('Login')} style={styles.signInLink}>
          Sign In
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
  button: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#8E2DE2',
    fontWeight: 'bold',
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
  },
  signInLink: {
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

export default RegisterScreen;
