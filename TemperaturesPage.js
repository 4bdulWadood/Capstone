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

  const getTemperature = async () => {
    try {
      const response = await axios.get("http://localhost:3001/auth/temperature");
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
      const response = await axios.post("http://localhost:3001/auth/savetemperature", { temperature: currentTemp });
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
            <TouchableOpacity style={styles.button} onPress={increaseTemp}>
              <Text>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={decreaseTemp}>
              <Text>-</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => saveTemp(tempValue)}>
              <Text>Maintain</Text>
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
  },
  button: {
    padding: 20,
    margin: 20,
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
});

export default TemperaturesPage;

