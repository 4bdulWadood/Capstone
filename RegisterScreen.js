import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import { Button, Card, Title, IconButton } from 'react-native-paper';

const COLORS = {
  primary: '#007aff',
  background: '#fff',
  text: '#222',
  error: 'red',
};

const RegisterScreen = ({ navigation }) => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleHome = () => {
    navigation.navigate('Home');
  };

  const handleRegister = async () => {
    try {
      const registrationData = { employeeName, employeeId, password };
      const response = await axios.post('http://18.216.105.223:3001/auth/register', registrationData);
      console.log('User registered successfully:', response.data);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Icon added above the Card */}
      <IconButton
        icon="account-check-outline"
        color={COLORS.primary}
        size={70}
        onPress={() => console.log('Icon pressed')}
        style={styles.icon}
      />

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Registration</Text>
          <TextInput
            style={styles.input}
            placeholder="Employee Name"
            value={employeeName}
            onChangeText={(text) => setEmployeeName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Employee ID"
            value={employeeId}
            onChangeText={(text) => setEmployeeId(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.btn} onPress={handleRegister}>
            <Text style={styles.btnText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={handleHome}>
            <Text style={styles.btnText}>Home</Text>
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
    backgroundColor: '#e8ecf4',
  },
  icon: {
    position: 'absolute',
    top: 30,
    right: 135,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: COLORS.text,
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    height: 44,
    width: '100%', // Changed width to 100%
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    borderColor: COLORS.primary,
    borderBottomWidth: 1,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    marginBottom: 16,
    width: '100%', // Changed width to 100%
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.background,
  },
  errorMessage: {
    color: COLORS.error,
    marginTop: 10,
  },
  card: {
    padding: 5,
  },
});

export default RegisterScreen;
