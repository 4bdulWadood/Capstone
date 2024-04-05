import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import BottomTabNavigator from './BottomTabNavigator';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import colors from './colors';  // Assuming colors.js is in the same directory

const COLORS = {
  primary: '#075eec',
  secondary: '#222',
  white: '#fff',
};

const LoginScreen = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = async () => {
    try {
      const loginData = { employeeId, password };
      //const response = await axios.post('http://18.216.74.246:3001/auth/login', loginData);
      const response = await axios.post('http://localhost:3001/auth/login', loginData);

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
      {/* Icon added above the Card */}
      <IconButton
        icon="login-variant"
        color={COLORS.primary}
        size={70}
        onPress={() => console.log('Icon pressed')}
        style={styles.icon}
      />

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Login</Title>
          <Paragraph style={styles.subtitle}>Manage your workspace here</Paragraph>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(email) => setEmployeeId(email)}
            placeholder="Email address"
            placeholderTextColor="#6b7280"
            style={styles.inputControl}
            value={employeeId}
          />

          <TextInput
            autoCorrect={false}
            onChangeText={(pwd) => setPassword(pwd)}
            placeholder="Password"
            placeholderTextColor="#6b7280"
            style={styles.inputControl}
            secureTextEntry={true}
            value={password}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.btn}
            labelStyle={styles.btnText}
          >
            Sign in
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.formFooter}>
            <Text style={styles.formFooterText}>
              Don't have an account? <Text style={styles.formFooterLink}>Sign up</Text>
            </Text>
          </TouchableOpacity>

          {error !== '' && <Text style={styles.errorMessage}>{error}</Text>}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#40E0D0', // Updated to match the blue color
  },
  card: {
    width: '80%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
    height: '60%',
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#f1f5f9',
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.secondary,
  },
  btn: {
    borderRadius: 8,
    marginBottom: 24,
    backgroundColor: COLORS.primary,
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: COLORS.white,
  },
  formFooter: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  formFooterText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.secondary,
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  formFooterLink: {
    textDecorationLine: 'underline',
  },
  errorMessage: {
    color: COLORS.primary,
    marginTop: 10,
  },
  icon: {
    position: 'absolute',
    top: 30,
    right: 135,
  },  
});

export default LoginScreen;
