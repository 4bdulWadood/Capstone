import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import AddProjectPage from './AddProjectPage'; // Adjust the import path as needed
import TaskToggle from './TaskToggle'; // Import the TaskToggle component
import NotificationBar from './NotificationBar';
import CircularProgress from '@mui/material/CircularProgress';
import { useFocusEffect } from '@react-navigation/native';


// const API_URL = 'https://capstone-cmml.onrender.com'; // Define your API URL here
const API_URL = 'http://localhost:3001'; // Define your API URL here



const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();


const PHASES = [
  { name: 'Planning', percentage: Math.floor(Math.random() * 100) },
  { name: 'Implementation', percentage: Math.floor(Math.random() * 100) },
  { name: 'Testing', percentage: Math.floor(Math.random() * 100) },
  { name: 'Deployment', percentage: Math.floor(Math.random() * 100) },
];

const renderPhaseCard = (navigation, phase, projectName, project) => {
  var count = 0, count2 = 0;
  project.Tasks.forEach(item =>{
    if(phase.name === item.taskPhase){
      count++;
    }

    if(phase.name === item.taskPhase && item.taskComplete){
      count2++;
    }
  })
 
  console.log(count, count2);
  var percentage = (count2 / count) * 100;

  if(isNaN(percentage)){
    percentage = 0;
  }

//   return (
//     <TouchableOpacity onPress={() => navigation.navigate('Tasks', { phase, projectName })}>
//       <View style={styles.phaseCard}>
//         <Text style={styles.cardTitle}>{phase.name}</Text>
//         <Text style={styles.cardPercentage}>{`${percentage}% Completed`}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

return (
  <TouchableOpacity onPress={() => navigation.navigate('Tasks', { phase, projectName })}>
    <View style={styles.phaseCardContainer}>
      <View style={styles.phaseCard}>
        <Text style={styles.cardTitle}>{phase.name}</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.cardPercentage}>{`${percentage}% Completed`}</Text>
      </View>
    </View>
  </TouchableOpacity>
);
};



const PMPage = ({ route }) => {
  const { employeeId, employeeName} = route.params;
  console.log(employeeId, employeeName);
  const navigation = useNavigation();

  useEffect(() => {
    
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          {employeeId === 'admin' && (
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() => navigation.navigate('AddProjectPage')}
            >
              <Icon name="add-box" size={30} color='#a832ff' />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationBar')}
          >
            <Icon name="notifications" size={30} color='#a832ff' />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, employeeId]);

  return (
    <Stack.Navigator initialRouteName="PMTopTabNavigator" headerMode="none">
      <Stack.Screen name="PMTopTabNavigator" component={PMTopTabNavigator} initialParams={{ employeeId: employeeId, employeeName: employeeName }} />
      <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
      <Stack.Screen name="Tasks" component={TasksPage} initialParams={{ employeeId: employeeId }}/>
      <Stack.Screen name="AddProjectPage" component={AddProjectPage} />
      <Stack.Screen name="NotificationBar" component={NotificationBar} initialParams={{ employeeId: employeeId }}/>
    </Stack.Navigator>
  );
};


const renderTaskCard = (task, projectName) => {

return (
  <TouchableOpacity onPress={() => {/* handle task card press */}}>
    <View style={styles.phaseCardContainer}>
      <View style={styles.phaseCard}>
        <Text style={styles.cardTitle}>{task.taskName}</Text>
        <Text style={styles.phase}>{`Phase: ${task.taskPhase}`}</Text>
        {/* Include the TaskToggle component here */}
        
        <TaskToggle project={projectName} taskName={task.taskName} taskComplete={task.taskComplete} />
        
        <Text style={styles.employees}>
          Employees: {task.employees ? task.employees.join(', ') : 'None'}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);
};


const TasksPage = ({ route }) => {
  const { phase, projectName, employeeId } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState('');
  const [newTaskSize, setNewTaskSize] = useState('');
  const [newTaskNumEmployees, setNewTaskNumEmployees] = useState(1);
  const [newTaskEmployees, setNewTaskEmployees] = useState([]);
  const [employeeInputs, setEmployeeInputs] = useState([""]);

  const [projectTasks, setProjectTasks] = useState([]);
  const [newProjectName, setNewProjectName] = useState();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/projects`);
        console.log(response);
        const project = response.data.find((p) => p.Name === projectName);
  
        if (project) {
          const tasksForPhase = project.Tasks.filter((t) => t.taskPhase === phase.name);
          setProjectTasks(tasksForPhase);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
  
    fetchTasks();
    setNewProjectName(projectName); // Automatically set the project name
    setNewTaskPhase(phase.name)
  }, [phase.name, projectName]);

  const handleUpdateSampleEmployees = async () => {
    if (!newTaskName) {
      console.log('Please enter a task name before updating sample employees.');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/auth/users`);
      const user_Data = await axios.post(`${API_URL}/auth/get-suggestions.py`, {
        user_data: response.data,
        new_task_name: newTaskName,
      });

      const val = convertStringToJson();
      const val_json = JSON.parse(val);

      setNewTaskEmployees(val_json.map((name) => name.EmployeeName));

      function convertStringToJson() {
        const lines = user_Data.data.trim().split('\n');
        lines.shift();
        const employees = lines.map((line) => {
          const [id, ...nameParts] = line.trim().split(' ');
          const name = nameParts.join(' ');
          return { id: parseInt(id, 10), EmployeeName: name };
        });
        return JSON.stringify(employees, null, 2);
      }

      const jsonOutput = convertStringToJson(user_Data.data);
      console.log(jsonOutput);
    } catch (error) {
      console.error('Error fetching sample users:', error);
    }
  };

  const handleAddTask = () => {
    setIsModalVisible(true);
  };

  const handleSaveTask = async () => {
    // Assuming you have states for task name, due date, and possibly other details
    // Prepare the task details including the employee inputs
    const taskDetails = {
      project: newProjectName,
      taskName: newTaskName,
      taskPhase: newTaskPhase,
      taskSize: newTaskSize, 
      employees: employeeInputs.filter(input => input.trim() !== ''), // Filter out any empty strings
      taskSize: newTaskSize,
      employees: employeeInputs.filter((input) => input.trim() !== ''),
    };

    try {
      // Make the API call to submit the task details
      // Adjust the URL and request payload according to your backend API
       await axios.post(`${API_URL}/auth/addtask`, taskDetails);
       console.log('Task successfully added with employees');

      await axios.post(`${API_URL}/auth/addtasktoproject`, taskDetails);
      console.log('Task successfully added to project data');
  
      // Handle any post-save actions, like closing the modal or clearing the form
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding task with employees:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleNumEmployeesChange = (numEmployees) => {
    const clampedNumEmployees = Math.max(1, Math.min(5, numEmployees));
    setNewTaskNumEmployees(clampedNumEmployees);
    setEmployeeInputs(
      employeeInputs.slice(0, clampedNumEmployees).concat(Array(Math.max(clampedNumEmployees - employeeInputs.length, 0)).fill(''))
    );
  };

  const handleEmployeeInputChange = (text, index) => {
    const updatedInputs = [...employeeInputs];
    updatedInputs[index] = text;
    setEmployeeInputs(updatedInputs);
  };

  const renderEmployeeInputs = () => {
    return Array.from({ length: newTaskNumEmployees }, (_, index) => (
      <TextInput
        key={index}
        style={styles.inputField}
        placeholder={`Employee ${index + 1}`}
        value={employeeInputs[index]}
        onChangeText={(text) => handleEmployeeInputChange(text, index)}
      />
    ));
  };

  return (
    <View>
      <View style={styles.header}>
      <View>
  <Text style={styles.projectCardTitle}>{projectName}</Text>
</View>
   
          {employeeId === 'admin' && (
          <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
)}

      </View>
      <FlatList
        data={projectTasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => renderTaskCard(item, projectName)}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.splitScreenContainer}>
            <View style={styles.leftSide}>
              <Text style={styles.modalTitle}>Add Task</Text>
              <TextInput
              style={styles.inputField}
              placeholder="Project Name"
              value={newProjectName} // Set the value to newProjectName state
              editable={false} // Make the TextInput non-editable
              />

              <TextInput
                style={styles.inputField}
                placeholder="Task Name"
                onChangeText={(text) => setNewTaskName(text)}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Phase"
                onChangeText={(text) => setNewTaskPhase(text)}
                value={newTaskPhase} // Set the value to newProjectName state
                editable={false} // Make the TextInput non-editable
              />
              <TextInput
                style={styles.inputField}
                placeholder="Task Size"
                onChangeText={(text) => setNewTaskSize(text)}
              />
              <TextInput
                style={styles.inputField}
                placeholder="Number of Employees"
                onChangeText={(text) => setNewTaskNumEmployees(parseInt(text) || 0)}
              />
              <TouchableOpacity onPress={handleUpdateSampleEmployees} style={styles.updateButton}>
                <Text style={styles.addButtonText}>Generate AI suggestions</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.inputField}
                placeholder="Number of Employees"
                keyboardType="numeric"
                value={String(newTaskNumEmployees)}
                onChangeText={(text) => handleNumEmployeesChange(parseInt(text) || 1)}
              />
              {renderEmployeeInputs()}
            </View>
            <View style={styles.rightSide}>
              <Text style={styles.modalTitle}> AI Suggestion</Text>
              <FlatList
                data={newTaskEmployees}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.sampleEmployee}>{item}</Text>
                )}
              />
            </View>
          </View>
          <View style={styles.modalButtons}>
            <View style={styles.buttonWrapper}>
              <Button title="Save" onPress={handleSaveTask} />
            </View>
            <View style={[styles.buttonWrapper]}>
              <Button title="Cancel" onPress={handleCloseModal} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// to calculate projectCompletion
const calculateProjectCompletion = (project) => {
  let numCompletedTasks = 0;
  project.Tasks.forEach((task) => {
    if (task.taskComplete) {
      numCompletedTasks++;
    }
  });

  let percentageCompleted = Math.round((numCompletedTasks / project.Tasks.length) * 100);
  return isNaN(percentageCompleted) ? 0 : percentageCompleted;
};

const renderProjectCard = (navigation, project) => {
  const teamText = project.Team ? `Team: ${project.Team.join(', ')}` : 'Team: N/A';
  
  //Use the project.Name to calculate the Percentage_Complete for a project, need to go through all tasks in every phase. Display that instead of Percentage_Complete. 
  var num = 0;
  project.Tasks.forEach((val)=>{
      console.log(val)
      val.taskComplete ? num++ : null;
  })

  var percentage = Math.round((num/project.Tasks.length)*100);
  
  if(isNaN(percentage)){
    percentage = 0;
  }

  let color = '#2ecc71'; // Default color: green

  if (percentage < 35) {
    color = '#ff5c5c'; // Red color for less than 35%
  } else if (percentage >= 35 && percentage < 70) {
    color = '#f1c40f'; // Yellow color for 35% to 70%
  }

return (
  <TouchableOpacity
    onPress={() => navigation.navigate('ProjectDetails', { project, navigation })}
    style={styles.projectCard}
  >
    <View style={styles.leftContent}>
      <Text style={styles.projectTitle}>{project.Name}</Text>
      <Text style={styles.projectSubtitle}>Agile Development</Text>
      <View style={styles.dueDate}>
        <Icon name="event" size={12} style={styles.dueDateIcon} />
        <Text style={styles.dueDateText}>Due {project.Due_Date}</Text>
      </View>
      <View style={styles.taskCounter}>
        <Icon name="list" size={12} style={styles.taskIcon} />
        <Text style={styles.taskCounterText}>{project.Tasks.length} Tasks</Text>
      </View>
    </View>
    <View style={styles.rightContent}>
      <CircularProgress
        variant="determinate"
        value={percentage}
        color="secondary"
        thickness={5}
        size={80} // Adjust size based on your layout
        style={styles.progressCircle}
      />
      <Text style={styles.percentageText}>{`${percentage}%`}</Text>
    </View>
  </TouchableOpacity>
);
};



const ProjectDetailsScreen = ({ route }) => {
  const { project, navigation } = route.params;
  
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.5, // Adjust the width of the bars, default is 0.4
    //barRadius: 5, // Adjust the corner radius of the bars
    barStyle: {
      borderRadius: 10, // Additional styling for the bars, if needed
    },
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    fillShadowGradient: '#a832ff', // Or any other color you use in your app
    fillShadowGradientOpacity: 1,
    formatYLabel: label => label + '%',
  };
  

  const screenWidth = Dimensions.get("window").width;
  // const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 5; 

  const data = {
    labels: PHASES.map(phase => phase.name), //yAxisLabel: 'Percentage Complete',
    datasets: [{
      data: PHASES.map(phase => {
        var count = 0, count2 = 0;
    
        project.Tasks.forEach(item =>{
          if(phase.name === item.taskPhase){
            count++;
          }
      
          if(phase.name === item.taskPhase && item.taskComplete){
            count2++;
          }
        })
    
        var percentage = (count2 / count) * 100;
        if(isNaN(percentage)){
          percentage = 0;
        }
    
        return percentage;
      })
    }]
  };

  //Calculate phase and phase percentage data by querying the backend, for the projects just like before, and setting the value for the PHASE variable.
  console.log(project)

  return (
    <ScrollView>
      <View>
        <Text style={styles.mytext}>Project Phases</Text>
        <FlatList
          data={PHASES}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => renderPhaseCard(navigation, item, project.Name, project)}
          scrollEnabled={false} // Disables scrolling for the FlatList, since it's inside a ScrollView
        />
        <Text style={styles.mytext}>Progress Chart</Text>
        <BarChart
          data={data}
          width={chartWidth}
          height={220}
          yAxisLabel=""
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          style={styles.chartStyle}
        />
         
      </View>
    </ScrollView>
  );
};

const AllScreen = ({route}) => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const {employeeName} = route.params;

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/assignedprojects?employeeName=${employeeName}`);

      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Error fetching projects');
    }
  };

  // useEffect(() => {
  //   fetchProjects();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      fetchProjects();
      // The empty array ensures this effect runs only once upon focusing
    }, [])
  );


  return (
    <ScrollView>
      <View>
        {/* <Text style={styles.mytext}>All Projects</Text> */}
        {/* <TouchableOpacity onPress={fetchProjects} style={{ alignSelf: 'flex-end', marginTop: -10 }}>
          <Icon name="refresh" size={20} color='#a832ff' style={{ marginRight: 20, marginTop: -20, marginBottom: 5 }} />
        </TouchableOpacity> */}

        <FlatList
          style={{ flex: 1 }}
          data={projects}
          keyExtractor={(item) => item.Name}
          renderItem={({ item }) => renderProjectCard(navigation, item)}
        />
      </View>
    </ScrollView>
  );
};

const OngoingScreen = ({ route }) => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const { employeeName } = route.params;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/assignedprojects?employeeName=${employeeName}`);
        const filteredProjects = response.data.filter((project) => calculateProjectCompletion(project) < 100);
        setProjects(filteredProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <ScrollView>
      <View>
        {/* <Text style={styles.mytext}>Ongoing Projects</Text> */}
        <FlatList
          data={projects}
          keyExtractor={(item) => item.Name}
          renderItem={({ item }) => renderProjectCard(navigation, item)}
        />
      </View>
    </ScrollView>
  );
};

const CompletedScreen = ({ route }) => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const { employeeName } = route.params;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/assignedprojects?employeeName=${employeeName}`);
        const filteredProjects = response.data.filter((project) => calculateProjectCompletion(project) === 100);
        setProjects(filteredProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <ScrollView>
      <View>
        {/* <Text style={styles.mytext}>Completed Projects</Text> */}
        <FlatList
          data={projects}
          keyExtractor={(item) => item.Name}
          renderItem={({ item }) => renderProjectCard(navigation, item)}
        />
      </View>
    </ScrollView>
  );
};
const PMTopTabNavigator = ({ route }) => {
  // Destructuring employeeId and employeeName from route.params
  const { employeeId, employeeName } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen name="All" component={AllScreen} initialParams={{ employeeName: employeeName }} />
      <Tab.Screen name="Ongoing" component={OngoingScreen} initialParams={{ employeeName: employeeName }} />
      <Tab.Screen name="Completed" component={CompletedScreen} initialParams={{ employeeName: employeeName }} />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectCardTitle: {
    backgroundColor: '#F0EBE3',
    borderRadius: 20,
    padding: 15,
    marginVertical: 8,
    marginLeft: 2,
    marginRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    fontWeight: 'bold'
  },
  leftContent: {
    flex: 1,
    justifyContent: 'center',
  },
  rightContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  projectSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dueDateIcon: {
    marginRight: 8,
    color: '#666',
  },
  dueDateText: {
    fontSize: 12,
    color: '#666',
  },
  taskCounter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIcon: {
    marginRight: 8,
    color: '#666',
  },
  taskCounterText: {
    fontSize: 12,
    color: '#666',
  },
  percentageText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
    position: 'absolute',
    textAlign: 'center',
  },
  phaseCardContainer: {
    backgroundColor: '#111',
    borderRadius: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 16,

  },
 
  phaseText: {
    fontSize: 16,
    color: '#555',
  },
  taskCard: {
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    marginLeft: 2,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#a832ff', // Neon-ish purple border color
    marginBottom: 12,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phase: {
    color: '#555',
    marginBottom: 8,
  },
  completionStatus: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2ecc71',
  },
  
  // cardTitle: {
  //   fontSize: 15,
  //   fontWeight: 'bold',
  //   marginBottom: 8,
  //   fontFamily: 'sans-serif'
  // },
  cardText: {
    fontSize: 14,
    fontFamily: 'sans-serif',
    marginBottom: 6,
    color: '#000000'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#a832ff',
    padding: 7,
    borderRadius: 5,
  },
  updateButton: {
    backgroundColor: '#2ecc71', // Green background color
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden', // Ensure border-radius works as expected
    width: '80%', // Adjust the width as needed
    maxWidth: 400, // Maximum width for the modal
    elevation: 5,
  },
  modalTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 4,
    backgroundColor: '#3498db', // Header background color
    color: '#fff', // Header text color
    textAlign: 'center',
  },
  inputField: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between', // or 'space-around' based on your preference
    marginHorizontal: 20, // Adjust the margin as needed
    marginTop: 20,
    width: "150%"
  },
 
  saveButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginRight: 10, // Add margin to the right of "Save" button
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
    width: "150%" 
  },
  buttonWrapper: {
    flex: 2,
    marginHorizontal: 10, // Add margin to each button
    width: "100px",
    backgroundColor: 'red'
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    marginLeft: 10, // Add margin to the left of "Cancel" button
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  splitScreenContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  leftSide: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  rightSide: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0e0e0',
  },
  sampleEmployee: {
    fontSize: 16,
    marginBottom: 10,
  },
  employees: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },

  mytext: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 5,
    marginRight: 5,
    marginLeft: 22,
  },

  // Add the new styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
 

 

  phaseText: {
    marginTop: 10,
    color: '#3498db',
  },

  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phase: {
    marginVertical: 5,
  },
  completionStatus: {
    marginVertical: 5,
    color: '#3498db',
  },
  employees: {
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  splitScreenContainer: {
    flexDirection: 'row',
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  leftSide: {
    padding: 20,
    width: '60%',
  },
  rightSide: {
    padding: 20,
    width: '40%',
    backgroundColor: '#ecf0f1',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  updateButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  sampleEmployee: {
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  chart: {
    marginTop: 10, // Add margin top
    marginBottom: 10,
    borderRadius: 20, // Add border radius
    borderWidth: 2, // Add border width if needed
    borderColor: '#000', // Add border color if needed
    
  },
  
  leftContent: {
    flex: 1,
  },
  rightContent: {
    marginLeft: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  percentText:{
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    width: 1, // Width of the separator line
    height: '80%', // Height of the separator line, adjust as needed
    backgroundColor: '#888', // Grey color of the separator line
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    shadowColor: '#000', // Color of the shadow
    shadowOffset: {
      width: 0, // No horizontal shadow offset
      height: 3, // Adjust the vertical shadow offset
    },
    shadowOpacity: 0.6, // Opacity of the shadow
    shadowRadius: 3, // Radius of the shadow
  },

  duedate:{
    color: '#FF5C5C',
    fontWeight: 'bold',
    marginBottom: 8,
  },

  // phaseCard: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   backgroundColor: 'white',
  //   borderRadius: 20,
  //   padding: 20,
  //   marginVertical: 8,
  //   marginHorizontal: 16,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 2,
  //   elevation: 3,
  // },
  phaseCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  chartStyle: {
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginTop: 12
  },
  progressBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 5,
    overflow: 'hidden',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    // This will ensure the progressBar doesn't go outside the bounds of the card
    marginVertical: 10, // Add some vertical margin if you want space around the bar
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#a832ff',
    borderRadius: 5, // Optional if you want the bar to have rounded corners
  },
  cardDetailText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  // container: {
  //   flex: 1,
  //   alignItems: 'center', // Center items horizontally in the container
  //   justifyContent: 'flex-start', // Align items to the top of the container
  //   paddingTop: 20, // Space from the top of the container
  //   backgroundColor: '#FFFFFF', // Background color of the overall screen
  // },

  // same color theme
  progressCircle:{
    color: '#a832ff'
  }

});



export default PMPage;