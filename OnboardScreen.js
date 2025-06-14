import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const backgroundStyle = Platform.select({
  web: {
    backgroundImage: 'linear-gradient(180deg, #94B3FD 0%, #B983FF 100%)',
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  default: {
    flex: 1,
  },
});

export default function OnboardScreen() {
  const navigation = useNavigation();

  const handleDone = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={[styles.container, backgroundStyle]}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        skipLabel="Skip" // Optionally customize skip label
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            image: (
              <View style={styles.lottieContainer}>
                <LottieView source={require('./animations/arrow.json')} autoPlay loop />
                <Text style={styles.titleText}>Welcome to DeskSynergy</Text>
              </View>
            ),
          },
          {
            image: (
              <View style={styles.lottieContainer}>
                <LottieView source={require('./animations/happy.json')} autoPlay loop />
                <Text style={styles.titleText}>Boost Productivity</Text>
                <Text style={styles.smallText}>Seamless Work collaboration</Text>
              </View>
            ),
          },
          {
            image: (
              <View style={styles.lottieContainer}>
                <LottieView source={require('./animations/WorkEnvironment.json')} autoPlay loop />
                <Text style={styles.titleText}>Work Seamlessly</Text>
                <Text style={styles.smallText}>Handle office functions in one place</Text>
              </View>
            ),
          },
          {
            image: (
              <View style={styles.lottieContainer}>
                <LottieView source={require('./animations/rocket.json')} autoPlay loop />
                <Text style={styles.titleText}>Achieve Higher Goals</Text>
                <Text style={styles.smallText}>Manage Better, Perform Better!</Text>
              </View>
            ),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Set to transparent to let the background style show
  },
  lottieContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    marginTop: 20,
    fontSize: 27,
    fontWeight: 'bold',
    color: 'white',
  },
  smallText: {
    marginTop: 10,
    fontSize: 21,
    color: 'white',
  },
});
