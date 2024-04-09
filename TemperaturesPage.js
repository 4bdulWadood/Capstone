import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";

const TemperaturesPage = ({ route }) => {
  const [tempValue, setTempValue] = useState(10);
  const [tempColor, setTempColor] = useState("cold");
  const empid = route.params.employeeId;

  useEffect(() => {
    getTemperature();
  }, []);

  const url = 'https://capstone-cmml.onrender.com'

  const getTemperature = async () => {
    try {
      const response = await axios.get(`${url}/auth/temperature`);
      setTempValue(response.data);
      if (response.data >= 15) {
        setTempColor("hot");
      } else {
        setTempColor("cold");
      }
    } catch (error) {
      console.error(`Error fetching temperature: ${error}`);
    }
  };

  const increaseTemp = () => {
    if (tempValue < 30) {
      const newTemp = tempValue + 1;
      setTempValue(newTemp);
      if (newTemp > 14) {
        setTempColor("hot");
      }
    }
  };

  const decreaseTemp = () => {
    if (tempValue > 1) {
      const newTemp = tempValue - 1;
      setTempValue(newTemp);
      if (newTemp < 15) {
        setTempColor("cold");
      }
    }
  };

  const saveTemp = async (currentTemp) => {
    try {
      const response = await axios.post(`${url}/savetemperature`, { temperature: currentTemp });
      setTempValue(response.data.temperature);
    } catch (error) {
      console.error(`Error saving temperature: ${error}`);
    }
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.temperatureDisplayContainer}>
        <View style={[styles.temperatureDisplay, tempColor === "hot" ? styles.hot : styles.cold]}>
          <Text style={styles.temperatureText}>{tempValue}</Text>
        </View>
      </View>
      {empid === "admin" && (
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.circularButton, { backgroundColor: 'white' }]} onPress={increaseTemp}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.circularButton, { backgroundColor: 'white' }]} onPress={decreaseTemp}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: 'white' }]} onPress={() => saveTemp(tempValue)}>
              <Text style={[styles.buttonText, styles.maintainButton]}>Maintain</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  temperatureDisplayContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  temperatureDisplay: {
    borderRadius: 110,
    height: 220,
    width: 220,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 48,
    color: "#04040A",
  },
  temperatureText: {
    fontSize: 48,
    color: "#04040A",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30, // Adjust the margin top to control the spacing between button containers
  },
  button: {
    paddingVertical: 10, // Adjust padding to make the buttons bigger
    paddingHorizontal: 20,
    marginHorizontal: 20, // Adjust horizontal margin for better spacing between buttons
    borderWidth: 2,
    borderColor: '#a832ff', // Neon-ish purple border color
    shadowColor: '#a832ff', // Neon-ish purple shadow color
    shadowOffset: { width: 0, height: 3 }, // Adjust shadow offset
    shadowOpacity: 0.5, // Adjust shadow opacity
    shadowRadius: 5, // Adjust shadow radius
    elevation: 5,
    borderRadius: 20
  },
  circularButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60, // Make the circular button width and height same
    height: 60,
    borderRadius: 30, // Make border radius half of the width and height to make it circular
    borderWidth: 2,
    borderColor: '#a832ff', // Neon-ish purple border color
    shadowColor: '#a832ff', // Neon-ish purple shadow color
    shadowOffset: { width: 0, height: 3 }, // Adjust shadow offset
    shadowOpacity: 0.5, // Adjust shadow opacity
    shadowRadius: 5, // Adjust shadow radius
    elevation: 5, // Android elevation for shadow effect
    marginHorizontal: 20,
  },

  buttonText: {
    fontSize: 24, // Adjust the font size for the button text
    fontWeight: 'bold'
  },
  cold: {
    shadowColor: "#3737CD",
    shadowOffset: { width: 5, height: 10 },
    shadowRadius: 75,
    shadowOpacity: 1,
  },
  hot: {
    shadowColor: "#ff0000",
    shadowOffset: { width: 5, height: 10 },
    shadowRadius: 75,
    shadowOpacity: 1,
  },
  maintainButton: {
    fontSize: 20, // Adjust the font size for the Maintain button text
  },
});

export default TemperaturesPage;
