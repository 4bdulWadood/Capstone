// import React, { useState } from 'react';
// import { View, Text, Switch, StyleSheet } from 'react-native';
// import axios from 'axios'; // Import axios for making HTTP requests

// const TaskToggle = ({ project, taskName }) => { // Pass project and taskName as props
//   const [isComplete, setIsComplete] = useState(false);

//   const onToggleSwitch = async () => { // Make the function asynchronous to perform HTTP request
//     try {
//         console.log("In the TASK API")
//       // Make a POST request to the API route
//       await axios.post('http://localhost:3001/auth/tasktoggle', {
//         project: project,
//         taskName: taskName,
//         taskComplete: !isComplete // Toggle the task completion status
//       });

//       // If the request is successful, update the state
//       setIsComplete(prevValue => !prevValue);
//     } catch (error) {
//       console.error('Error updating task completion status:', error);
//       // Handle error here
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Task Status</Text>
//       <Switch
//         trackColor={{ false: '#767577', true: '#81b0ff' }}
//         thumbColor={isComplete ? '#f5dd4b' : '#f4f3f4'}
//         ios_backgroundColor="#3e3e3e"
//         onValueChange={onToggleSwitch}
//         value={isComplete}
//       />
//       <Text style={styles.statusText}>{isComplete ? 'Complete' : 'Incomplete'}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   label: {
//     marginRight: 10,
//   },
//   statusText: {
//     marginLeft: 10,
//   },
// });

// export default TaskToggle;

import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const TaskToggle = () => {
  const [isComplete, setIsComplete] = useState(false);

  const onToggleSwitch = () => {
    setIsComplete((prevValue) => !prevValue);
    // Add logic to update the completion status in your backend/API
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