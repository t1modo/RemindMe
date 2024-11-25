import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../components/FirebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const year = date.getUTCFullYear();
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
      <View style={styles.loadingContainer}>
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

      {/* Task Input Modal */}
      {showModal && (
        <View style={styles.modal}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Task</Text>
              <TextInput
                style={styles.input}
                placeholder="Class Name"
                value={className}
                onChangeText={setClassName}
              />
              <TextInput
                style={styles.input}
                placeholder="Assignment Name"
                value={assignmentName}
                onChangeText={setAssignmentName}
              />
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowCalendarModal(true)}
              >
                <Text style={{ color: dueDate ? '#000' : '#9CA3AF' }}>
                  {dueDate ? formatDate(dueDate) : 'Select Due Date'}
                </Text>
              </TouchableOpacity>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleAddTask}>
                  <Text style={styles.saveButtonText}>Save Task</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}

      {/* Calendar Modal */}
      {showCalendarModal && (
        <View style={styles.modal}>
          <View style={styles.calendarModalContent}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [markedDate]: { selected: true, selectedColor: '#40916C', selectedTextColor: '#fff' },
              }}
              monthFormat={'MMMM yyyy'}
              markingType="simple"
              theme={{
                textSectionTitleColor: '#000',
                arrowColor: '#40916C',
                dayTextColor: '#000',
                selectedDayBackgroundColor: '#40916C',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#40916C',
              }}
              minDate={today}
            />
            <TouchableOpacity
              style={styles.closeCalendarButton}
              onPress={() => setShowCalendarModal(false)}
            >
              <Text style={styles.closeCalendarButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#40916C",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  calendarModalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: 'center',
  },
  closeCalendarButton: {
    marginTop: 20,
    backgroundColor: "#40916C",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  closeCalendarButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Tasks;
