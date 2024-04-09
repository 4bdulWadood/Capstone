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
      <Text style={styles.label}>Task Status</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isComplete ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onToggleSwitch}
        value={isComplete}
      />
      <Text style={styles.statusText}>{isComplete ? 'Complete' : 'Incomplete'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    marginRight: 10,
  },
  statusText: {
    marginLeft: 10,
  },
});

export default TaskToggle;