import React, { useState } from 'react';
import { View, Text, Image } from 'react-native'; // Import Image component
import Slider from '@react-native-community/slider';
import temperatureImage from './images/thermometer.jpg'; // Import your JPEG image

const TemperaturesPage = () => {
  const [sliderValue, setSliderValue] = useState(0); // State to hold the slider value

  // Format temperature value with 'degrees Fahrenheit' string
  const formatTemperature = (value) => {
    if (typeof value === 'number' && !isNaN(value)) {
      const intValue = Math.round(value); // Round the value to the nearest integer
      return `${intValue} °F`;
    } else {
      return '0 °F'; // Handle null, undefined, or NaN values
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Temperature Page</Text>
      <Image source={temperatureImage} style={{ width: 200, height: 200 }} /> {/* Display the image */}
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        step={1}
        value={sliderValue}
        onValueChange={(value) => setSliderValue(value)}
      />
      <Text>{formatTemperature(sliderValue)}</Text>
    </View>
  );
};

export default TemperaturesPage;