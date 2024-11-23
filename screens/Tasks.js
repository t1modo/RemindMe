import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../components/FirebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = (date.getDate() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [className, setClassName] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [markedDate, setMarkedDate] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); 
      if (!user) {
        navigation.replace('Login');
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const q = query(tasksRef, orderBy('dueDate')); 

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [user]);

  const deleteOldTasks = async () => {
    if (!user) {
      console.warn("Skipping task deletion, no user logged in.");
      return;
    }

    try {
      const tasksRef = collection(db, 'users', user.uid, 'tasks');
      const querySnapshot = await getDocs(tasksRef);

      const today = new Date();
      today.setDate(today.getDate() - 1);
      today.setHours(0, 0, 0, 0);

      querySnapshot.forEach(async (docSnap) => {
        const task = docSnap.data();
        const taskDueDate = new Date(task.dueDate);

        if (taskDueDate < today) {
          await deleteDoc(doc(db, 'users', user.uid, 'tasks', docSnap.id));
        }
      });
    } catch (error) {
      console.error("Error fetching or deleting tasks: ", error.message);
    }
  };

  useEffect(() => {
    if (!user) return;
    const intervalId = setInterval(() => {
      deleteOldTasks();
    }, 86400000);

    return () => clearInterval(intervalId);
  }, [user]);

  useEffect(() => {
    if (user) deleteOldTasks();
  }, [user]);

  const handleAddTask = async () => {
    if (!className || !assignmentName || !dueDate) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'tasks'), {
        class: className,
        assignmentName: assignmentName,
        dueDate: dueDate,
      });
      setClassName('');
      setAssignmentName('');
      setDueDate('');
      setMarkedDate('');
      setShowModal(false);
    } catch (error) {
      Alert.alert("Error", "Failed to add task: " + error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'tasks', taskId));
    } catch (error) {
      Alert.alert("Error", "Failed to delete task: " + error.message);
    }
  };

  const handleDateSelect = (date) => {
    const selectedDate = date.dateString;
    setDueDate(selectedDate);
    setMarkedDate(selectedDate);
    setShowCalendarModal(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskInfo}>
        <Text style={styles.taskText}>{item.class}</Text>
        <Text style={styles.taskName}>({item.assignmentName})</Text>
        <Text style={styles.dueDate}>{formatDate(item.dueDate)}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
        <FontAwesome name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#40916c', '#52b788', '#74c69d']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <Text style={styles.tasksLabel}>Tasks</Text>

        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tasksList}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowModal(true)}
        >
          <FontAwesome name="plus-circle" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  tasksLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 45,
    marginBottom: 10,
    textAlign: 'center',
  },
  tasksList: {
    flexGrow: 1,
    width: '100%',
    marginTop: 20,
  },
  taskItem: {
    backgroundColor: "#E5E7EB",
    margin: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginRight: 10,
  },
  taskName: {
    fontSize: 16,
    color: "#1F2937",
    marginRight: 10,
  },
  dueDate: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#52b788",
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default Tasks;
