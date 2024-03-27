import React, { useState, useEffect } from "react";
import axios from "axios";
import './TemperaturesPage.css';

export default function TemperaturesPage({ route }) {
  const [tempValue, setTempValue] = useState(10);
  const [tempColor, setTempColor] = useState("cold");
  const empid = route.params.employeeId

  console.log('temp',empid)

  useEffect(() => {
    getTemperature();
  }, []);

  const getTemperature = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/auth/temperature`);
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
      const response = await axios.post(`http://localhost:3001/auth/savetemperature`, { temperature: currentTemp });
      setTempValue(response.data.temperature);
    } catch (error) {
      console.error(`Error saving temperature: ${error}`);
    }
  };

  return (
    <div className="app-container">
      <div className="temperature-display-container">
        <div className={`temperature-display ${tempColor}`}>{tempValue}</div>
      </div>
      {empid === 'admin' && (
        <>
          <div className="button-container">
            <button onClick={increaseTemp}>+</button>
            <button onClick={decreaseTemp}>-</button>
          </div>
          <div className="button-container">
            <button onClick={() => saveTemp(tempValue)}>Maintain</button>
          </div>
        </>
      )}
    </div>
  );
}
