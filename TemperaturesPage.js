import React, { useState } from "react";
import './TemperaturesPage.css'; // Import the CSS styles

export default function TemperaturesPage() {
  const [tempValue, setTempValue] = useState(10);
  const [tempColor, setTempColor] = useState("cold");

  const increaseTemp = () => {
    setTempValue(tempValue + 1);

    if (tempValue >= 30) { // Fixed logic to prevent going above 30
      return;
    }

    if (tempValue >= 14) {
      setTempColor("hot");
    }
  };

  const decreaseTemp = () => {
    setTempValue(tempValue - 1);

    if (tempValue <= 1) { // Fixed logic to prevent going below 0
      return;
    }

    if (tempValue <= 15) {
      setTempColor("cold");
    }
  };

  console.log(tempColor);

  return (
    <div className="app-container">
      <div className="temperature-display-container">
        <div className={`temperature-display ${tempColor}`}>{tempValue}</div>
      </div>
      <div className="button-container">
        <button onClick={increaseTemp}>+</button>
        <button onClick={decreaseTemp}>-</button>
      </div>
    </div>
  );
}
