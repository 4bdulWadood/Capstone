import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import axios from 'axios';

const TaskToggle = ({ project, taskName, taskComplete }) => {
  useEffect(() => {
    console.log(project);
    
  }, []);

  const [isComplete, setIsComplete] = useState(taskComplete);
 
  const onToggleSwitch = async() => {
    setIsComplete((prevValue) => !prevValue);
    console.log(project)
    await axios.post('https://capstone-cmml.onrender.com/auth/tasktoggle', {
      project: project, 
      taskName: taskName,
      taskComplete: !isComplete
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error('Error updating task completion status:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{isComplete ? 'Status: Complete' : 'Status: Incomplete'}</Text>
      <Switch
        trackColor={{ false: '#FF6B6B', true: '#4ECDC4' }}
        thumbColor={isComplete ? '#FFFFFF' : '#FFFFFF'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onToggleSwitch}
        value={isComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 3,
  },
  label: {
    fontWeight: 'bold',
    color: '#344955',
    flex: 1,
  },
  statusText: {
    marginLeft: 10,
  },
});

export default TaskToggle;