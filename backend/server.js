// server.js

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./User');
const Project = require('./Projects');
const Room = require('./Rooms');
const Notification = require('./Notifications');
const Temperature = require('./Temperature');

const { exec } = require('child_process');
const { getSystemErrorMap } = require('util');


const app = express();

// Express middleware and configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Connect to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/auth');


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@capstone.ewnejlz.mongodb.net/auth?retryWrites=true&w=majority&appName=Capstone";
mongoose.connect(uri).then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));


// API data routes
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});
// Authentication routes
const authRoutes = express.Router();

authRoutes.get('/users', async (req, res) => {
  console.log('Fetching user data from the database');
  try {
    // Fetch all users from MongoDB
    const users = await User.find();
    res.json(users);
    console.log(users)
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred while fetching user data.');
  }
});

authRoutes.post('/get-suggestions.py', (req, res) => {
  // Build the command to execute the Python script
  console.log('reached suggestions api');
  const { user_data, new_task_name } = req.body;
  //console.log(user_data);
  console.log(new_task_name);

  // Convert user_data array to a JSON string
  const jsonData = JSON.stringify(user_data);
  const jsonData2 = JSON.stringify(new_task_name);

  // Escape special characters to prevent potential security issues
  const sanitizedJsonData = jsonData.replace(/"/g, '\\"');

  const command = `python3 suggestions.py "${sanitizedJsonData}" "${new_task_name}" `;

  // Execute the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing the Python script: ${error.message}`);
      return res.status(500).send('Internal Server Error');
    }

    // Log the script output
    console.log(`${stdout}`);

    // Send the script output as the response
    res.send(stdout);
  });
});


authRoutes.post('/register', async (req, res) => {
  const { employeeName, employeeId, password } = req.body;

  // Check if employeeId is provided and not null
  if (!employeeId) {
    return res.status(400).send('Employee ID is required.');
  }

  console.log('Received registration request:', { employeeName, employeeId, password });

  try {
    // Save user data to MongoDB
    const newUser = new User({ employeeName, employeeId, password });
    await newUser.save();

    res.send('Registration successful.');
    console.log('Registration Successful');
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred while registering.');
  }
});

// Project routes
const projectRoutes = express.Router();

projectRoutes.post('/projects', async (req, res) => {
  const { Name, Percentage_Complete, Due_Date, Team } = req.body;
  
  try {
    const newProject = new Project({
      Name,
      Percentage_Complete,
      Due_Date,
      Team,
      // Initially, you can either omit the Tasks field or set it as an empty array
    });
    await newProject.save();
    res.send('Project added successfully.');
    console.log('Project Added Successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred while adding the project.');
  }
});

module.exports = projectRoutes; // Ensure you export the routes

projectRoutes.post('/addtasktoproject', async (req, res) => {
  const { project, taskName, taskPhase, taskSize, employees } = req.body;

  try {
    // Find the project by name
    const foundProject = await Project.findOne({ Name: project });

    if (!foundProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Prepare the new task object with provided details
    const newTask = {
      taskName,
      taskPhase,
      taskComplete: false, // Assuming a new task is not complete
      employees, // Assuming this is an array of employee names/IDs
    };

    // Add the new task to the project's Tasks array
    foundProject.Tasks.push(newTask);

    // Calculate the updated completion percentage if necessary
    // This is a placeholder for any logic you might have to update the project completion percentage

    // Save the updated project back to the database
    const updatedProject = await foundProject.save();

    res.status(200).json({ message: 'Task successfully added to project', updatedProject });

  } catch (error) {
    console.error('Error adding task to project:', error);
    res.status(500).json({ message: 'Error adding task to project in the database' });
  }
});


//Get Project Status 
//Inputs project name, planning
//Outputs percentage completed

//Get Phase Status
//Inputs phase name, project name 
//Outputs percentage completed

//Get Project Information

// Define a new route to get project data by name
projectRoutes.get('/project/:name', async (req, res) => {
  const projectName = req.params.name; // Get the project name from request params

  try {
    // Find the project by name
    const foundProject = await Project.findOne({ Name: projectName });

    if (!foundProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Return the project data
    res.status(200).json(foundProject);

  } catch (error) {
    console.error('Error retrieving project data:', error);
    res.status(500).json({ message: 'Error retrieving project data from the database' });
  }
});

projectRoutes.post('/tasktogglestatus', async (req, res) => {
  const { project, taskName } = req.body; // Destructure required fields from request body
  console.log("in the tasktogglestatus server.js")
  try {
    // Find the project by name
    const foundProject = await Project.findOne({ Name: project });
    
    if (!foundProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Locate the task to be updated
    const taskToUpdate = foundProject.Tasks.find(task => task.taskName === taskName);
    if (!taskToUpdate) {
      return res.status(404).json({ message: 'Task not found in the project' });
    }

    res.status(200).json({ message: taskToUpdate["taskComplete"] });

  } catch (error) {
    console.error('Error updating task completion status:', error);
    res.status(500).json({ message: 'Error updating task completion status in the database' });
  }
});

projectRoutes.post('/tasktoggle', async (req, res) => {
  const { project, taskName, taskComplete } = req.body; // Destructure required fields from request body
  console.log("in the tasktoggle server.js")
  try {
    // Find the project by name
    const foundProject = await Project.findOne({ Name: project });
    console.log(project)
    if (!foundProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Locate the task to be updated
    const taskToUpdate = foundProject.Tasks.find(task => task.taskName === taskName);
    if (!taskToUpdate) {
      return res.status(404).json({ message: 'Task not found in the project' });
    }

    // Update the taskComplete status of the found task
    taskToUpdate["taskComplete"] = taskComplete;

    // Save the updated project back to the database
    const updatedProject = await foundProject.save();

    res.status(200).json({ message: 'Task completion status updated successfully', updatedProject });

  } catch (error) {
    console.error('Error updating task completion status:', error);
    res.status(500).json({ message: 'Error updating task completion status in the database' });
  }
});


const roomRoutes = express.Router();

roomRoutes.get('/rooms/:roomName/times/:times', async (req, res) => {
 
  try {
    const { roomName, times } = req.params;

    // Find the room by ID (assuming your room is identified by roomName)
    const room = await Room.findOne({ Name: roomName });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if 'Times' property exists
if (room.Times && room.Times.length > 0) {
  // Find the time slot corresponding to the specified time
  const specifiedTimeSlot = room.Times.find(timeSlot => timeSlot.time === times);

  if (specifiedTimeSlot) {
    // Use the boolean value from the database
    const isTimeBooked = specifiedTimeSlot.booked;
    console.log(isTimeBooked)

    if (isTimeBooked) {
      console.log('Room is Available to be booked!');
      res.json({ booked: true });
    } else {
      console.log('Room is occupied, choose another timeslot.');
      res.json({ booked: false });
    }
  } else {
    console.log('Specified time slot not found.');
    res.json({ booked: false });
  }
} 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'An error occurred while fetching rooms data.' });
  }
});

// API to handle update values 
roomRoutes.put('/rooms/:roomName/times/:times', async (req, res) => {
  try {
    const { roomName, times } = req.params;
    const { booked } = req.body; // Get the booked status from the request body

    // Update the room by setting the booked value based on the request
    await Room.findOneAndUpdate(
      { Name: roomName, 'Times.time': times },
      { $set: { 'Times.$.booked': booked } } // Use the booked status from the request
    );

    // Send a success response
    res.json({ message: 'Booking status updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'An error occurred while updating room data.' });
  }
});



projectRoutes.get('/assignedprojects', async (req, res) => {
  const { employeeName } = req.query; // Extracting employeeName from query parameters
  console.log('in the projects api');
  try {
    let projects;
    if (employeeName === 'admin') {
      projects = await Project.find(); // Admin gets all projects
    } else {
      // For other employees, filter projects where they are part of the team or a task
      projects = await Project.find({
        $or: [
          { Team: employeeName }, // Included in the project team
          { "Tasks.employees": employeeName } // Included in any task's employees, corrected path
        ]
      });
    }
    console.log(projects);
    res.json(projects);
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred while fetching projects.');
  }
});

projectRoutes.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
    console.log(projects);
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred while fetching projects.');
  }
});

authRoutes.post('/login', async (req, res) => {
  const { employeeId, password } = req.body;

  // Check if employeeId and password are provided
  if (!employeeId || !password) {
    return res.status(400).send('Employee ID and password are required.');
  }

  console.log('Received login request:', { employeeId, password });

  try {
    // Find the user by employeeId and password
    const user = await User.findOne({ employeeId, password });

    if (!user) {
      console.log('Authentication failed: Incorrect credentials');
      return res.status(401).send('Authentication failed.');
    }


    // Assuming you fetch the employeeName from the user object
    var employeeInfo = {
      id: user.employeeId, // or simply employeeId
      name: user.employeeName, // Here you include the employeeName in the response
      pic: user.employeePic
    }
    // console.log(employeeInfo)
    res.json(employeeInfo);
    console.log('Login Successful');
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred during login.');
  }
});

// method to add tasks
authRoutes.post('/addtask', async (req, res) => {
  // Assuming the request body includes an array of employee names/IDs, task name, due date, and task size
  const { employees, taskName, dueDate, taskSize } = req.body;
  
  try {
    console.log("In the Add Task API");

    // Assuming each employee is identified by a unique name or ID in the employees array
    // Update each employee with the new task
    const task = { taskName, taskSize, activeTask: true }; // Prepare the task object

    const updates = employees.map(employeeName =>
      User.findOneAndUpdate(
        { employeeName: employeeName },
        { $push: { tasks: task }},
        { new: true }
      )
    );

    // Execute all the update operations
    const updatedUsers = await Promise.all(updates);

    // Filter out any null responses, in case some employee IDs were not found
    const successfulUpdates = updatedUsers.filter(user => user !== null);

    if(successfulUpdates.length > 0) {
      res.status(200).json({ message: `${successfulUpdates.length} tasks added successfully`, updatedUsers: successfulUpdates });
    } else {
      res.status(404).json({ message: 'No employees found to add tasks' });
    }
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: 'Error adding task to the database' });
  }
});

const notiRoutes = express.Router();

// Fetch notifications
notiRoutes.get('/notifications', async (req, res) => {
  const { employeeID } = req.query;
  // console.log('in the notification tab: ', employeeID)
  try {
    const notifications = await Notification.find({ targetEmployeeIds: employeeID });
    console.log(notifications)
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Server error');
  }
});

notiRoutes.post('/addnotifications', async (req, res) => {
  const { title, message, targetEmployeeIds, createdAt } = req.body;

  try {
    // Check if all targetEmployeeIds exist in the User collection by their employeeId
    const employeeChecks = targetEmployeeIds.map(async (id) => {
      console.log(id)
      const employeeExists = await User.findOne({ employeeId: id }); // Find by employeeId field
      console.log(employeeExists ? true : false)
      return employeeExists ? true : false;
     
    });
    
    const results = await Promise.all(employeeChecks);
    const allEmployeesExist = results.every(exists => exists);

    if (!allEmployeesExist) {
      return res.status(400).send('One or more Employee IDs do not exist.');
    }

    // If all employee IDs exist, proceed to create the notification
    const newNotification = new Notification({
      title,
      message,
      createdAt: createdAt ? new Date(createdAt) : undefined, // Use provided createdAt or default to current date/time
      targetEmployeeIds,
      readBy: [], // Initially, no one has read the notification
    });

    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).send('Server error');
  }
});

// Change the method to PATCH and adjust the route to better reflect the action
notiRoutes.patch('/notifications/read', async (req, res) => {
  const { title, employeeID } = req.query;
  
  try {
    // Find the notification by title and update it
    const notificationUpdated = await Notification.findOneAndUpdate(
      { title: title }, // Find a document by title
      { $addToSet: { readBy: employeeID } }, // Use $addToSet to add employeeID to the readBy array if it's not already present
      { new: true } // Return the updated document
    );

    if (!notificationUpdated) {
      return res.status(404).send('Notification not found.');
    }

    res.json(notificationUpdated);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).send('Server error');
  }
});

notiRoutes.delete('/notifications/delete', async (req, res) => {
  const { title } = req.query;
  
  try {
    // Delete the notification by title
    const notificationDeleted = await Notification.findOneAndDelete({ title: title });

    if (!notificationDeleted) {
      return res.status(404).send('Notification not found.');
    }

    // Optionally, return some information about the deleted notification
    res.json({ message: 'Notification successfully deleted', title: notificationDeleted.title });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).send('Server error');
  }
});


const tempRoutes = express.Router();
tempRoutes.get('/temperature', async (req, res) => {
  console.log('in the temp api');
  try {
    const temp = await Temperature.findOne(); // Find one document
    console.log(temp)
    if (temp) {
      res.json(temp.temperature); // Send the temperature of the first document found
    } else {
      res.status(404).send('Temperature not found');
    }
  } catch (error) {
    console.error('Error fetching temperature:', error);
    res.status(500).send('Server error');
  }
});

tempRoutes.post('/savetemperature', async (req, res) => {
  console.log('Saving new temperature');
  try {
    // Assume there is only one temperature document to update
    const result = await Temperature.findOneAndUpdate({}, { temperature: req.body.temperature }, { new: true, upsert: true });
    if (result) {
      res.json(result); // Send back the updated document
    } else {
      res.status(404).send('Temperature document not found and cannot be created');
    }
  } catch (error) {
    console.error('Error saving temperature:', error);
    res.status(500).send('Server error');
  }
});


app.use('/auth', authRoutes);
app.use('/auth', projectRoutes);
app.use('/auth', roomRoutes);
app.use('/auth', notiRoutes);
app.use('/auth', tempRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});