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
import { AnimatedCircularProgress } from 'react-native-circular-progress';  
// import Icon from 'react-native-vector-icons/FontAwesome';


const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const PHASES = [
  { name: 'Planning', percentage: Math.floor(Math.random() * 100) },
  { name: 'Implementation', percentage: Math.floor(Math.random() * 100) },
  { name: 'Testing', percentage: Math.floor(Math.random() * 100) },
  { name: 'Deployment', percentage: Math.floor(Math.random() * 100) },
];

const renderPhaseCard = (navigation, phase, projectName) => (
  <TouchableOpacity
    onPress={() => navigation.navigate('Tasks', { phase, projectName })}
  >
    <View style={styles.projectCard}>
        <Text style={styles.cardTitle}>{phase.name}</Text>
        <Text style={styles.cardText}>{phase.percentage}% Completed</Text>
    </View>
  </TouchableOpacity>
);

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
              <Icon name="add-box" size={30} color="#3498db" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationBar')}
          >
            <Icon name="notifications" size={30} color="#3498db" />
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


const renderTaskCard = (task) => {
  // If you need to log the task, do it inside the function body before the return statement.
  console.log('task', task);

  return (
    <View style={styles.taskCard}>
      <Text style={styles.taskName}>Task Name: {task.taskName}</Text>
      <Text style={styles.phase}>Phase: {task.taskPhase}</Text>
      
      {/* Include the TaskToggle component here */}
      <TaskToggle project={task.project} taskName={task.taskName} />

      <Text style={styles.completionStatus}>
        Completion Status: {task.taskComplete ? 'Complete' : 'Incomplete'}
      </Text>
      <Text style={styles.employees}>
        Employees: {task.employees ? task.employees.join(', ') : 'None'}
      </Text>
    </View>
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
        const response = await axios.get('http://localhost:3001/auth/projects');
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
  }, [phase.name, projectName]);

  const handleUpdateSampleEmployees = async () => {
    if (!newTaskName) {
      console.log('Please enter a task name before updating sample employees.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3001/auth/users');
      const user_Data = await axios.post('http://localhost:3001/auth/get-suggestions.py', {
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
       await axios.post('http://localhost:3001/auth/addtask', taskDetails);
       console.log('Task successfully added with employees');

      await axios.post('http://localhost:3001/auth/addtasktoproject', taskDetails);
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
        {/* <Text style={styles.mytext}>{phase.name}</Text> */}
        <Text style={styles.mytext}>{projectName}</Text>
          {employeeId === 'admin' && (
          <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
)}

      </View>
      <FlatList
        data={projectTasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => renderTaskCard(item)}
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
                onChangeText={(text) => setNewProjectName(text)}
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




const renderProjectCard = (navigation, project) => {
  const teamText = project.Team ? `Team: ${project.Team.join(', ')}` : 'Team: N/A';

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProjectDetails', { project, navigation })}
    >
      <View style={styles.projectCard}>
        <View style={styles.leftContent}>
          <Text style={styles.cardTitle}>{project.Name}</Text>
          <Text style={styles.duedate}>Due Date: {project.Due_Date}</Text>
          {/* <Text style={styles.cardText}>Tasks: {project.Tasks ? project.Tasks.join(', ') : 'N/A'}</Text> */}
          <Text style={styles.cardText}>{teamText}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.rightContent}>
          <Text style={styles.percentText}>Percentage: {project.Percentage_Complete}%</Text>
          <CircularProgress variant="determinate" value={project.Percentage_Complete} />
        </View>
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
    formatYLabel: label => label + '%',
  };
  

  const screenWidth = Dimensions.get("window").width;
  // const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 5; 

  const data = {
    labels: PHASES.map(phase => phase.name), //yAxisLabel: 'Percentage Complete',
    datasets: [{
      data: PHASES.map(phase => phase.percentage)
    }]
  };

  

  return (
    <ScrollView>
      <View>
        <Text style={styles.mytext}>Project Phases</Text>
        <FlatList
          data={PHASES}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => renderPhaseCard(navigation, item, project.Name)}
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
          style={styles.chart}
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
      const response = await axios.get(`http://localhost:3001/auth/assignedprojects?employeeName=${employeeName}`);
      // const response =  await axios.get(`http://localhost:3001/auth/projects`)
      setProjects(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Error fetching projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ScrollView>
      <View>
        <Text style={styles.mytext}>All Projects</Text>
        <TouchableOpacity onPress={fetchProjects} style={{ alignSelf: 'flex-end', marginTop: -10 }}>
          <Icon name="refresh" size={20} color="#3498db" style={{ marginRight: 20, marginTop: -20, marginBottom: 5 }} />
        </TouchableOpacity>

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

const OngoingScreen = ({route}) => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const {employeeName} = route.params;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/auth/assignedprojects?employeeName=${employeeName}`);
        // const response =  await axios.get(`http://localhost:3001/auth/projects`)
      setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const ongoingProjects = projects.filter((project) => project.Percentage_Complete < 100);

  return (
    <ScrollView>
      <View>
        <Text style={styles.mytext}>Ongoing Projects</Text>
        <FlatList
          data={ongoingProjects}
          keyExtractor={(item) => item.Name}
          renderItem={({ item }) => renderProjectCard(navigation, item)}
        />
      </View>
    </ScrollView>
  );
};

const CompletedScreen = ({route}) => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const {employeeName} = route.params;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
       const response = await axios.get(`http://localhost:3001/auth/assignedprojects?employeeName=${employeeName}`);
     
      setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const completedProjects = projects.filter((project) => project.Percentage_Complete === 100);

  return (
    <ScrollView>
      <View>
        <Text style={styles.mytext}>Completed Projects</Text>
        <FlatList
          data={completedProjects}
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
  // ... your existing styles
  phaseCardContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
  },
  phaseCard: {
    padding: 16,
  },
  // phaseTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 8,
  // },
  phaseText: {
    fontSize: 16,
    color: '#555',
  },
  taskCard: {
    backgroundColor: '#f0ffff',
      padding: 10,
      margin: 3,
      marginLeft: 2,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#000', // Black border
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
  projectCard: {
    backgroundColor: '#f0ffff',
    padding: 10,
    margin: 3,
    marginLeft: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000', // Black border
    flexDirection: 'row',
    justifyContent: 'space-between',   
    marginBottom: 12,
  },
  
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Snell Roundhandlic'
  },
  cardText: {
    fontSize: 14,
    font: "Quicksand",
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#005ced'
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
    backgroundColor: '#3498db',
    padding: 10,
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
    fontSize: 15,
    margin: 5,
    marginRight: 5
  },

  // Add the new styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  phaseCardContainer: {
    padding: 10,
  },
  phaseCard: {
    backgroundColor: '#ecf0f1',
    padding: 20,
    borderRadius: 10,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'AvenirNext-BoldItalic'
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
  }
  

});

export default PMPage;