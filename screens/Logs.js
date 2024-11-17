import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../components/FirebaseConfig";
import { getAuth } from "firebase/auth";

// Get device dimensions
const { width, height } = Dimensions.get("window");

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Logs = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);
      fetchAndNotify(currentUser.uid); // Fetch tasks and notify for today's due tasks
    } else {
      console.log("No user logged in");
    }
  }, []);

  const fetchAndNotify = async (userId) => {
    const tasksRef = collection(db, "users", userId, "tasks");
    const q = query(tasksRef);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todayNotifications = [];

      snapshot.forEach((doc) => {
        const task = doc.data();
        const taskDueDate = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);

        // Check if the task is due today
        taskDueDate.setHours(0, 0, 0, 0); // Normalize time
        if (taskDueDate.getTime() === today.getTime()) {
          todayNotifications.push({ id: doc.id, ...task });
          sendLocalNotification(task.assignmentName);
        }
      });

      setNotifications(todayNotifications); // Update state with today's notifications
    });

    return unsubscribe;
  };

  // Send a local notification
  const sendLocalNotification = (assignmentName) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Assignment Due Today 📌",
        body: `Your assignment "${assignmentName}" is due today!`,
      },
      trigger: null, // Immediate notification
    });
  };

  // Render a notification item
  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>
        {item.assignmentName} (Class: {item.class})
      </Text>
      <Text style={styles.notificationDueDate}>Due Today</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={["#40916c", "#52b788", "#74c69d"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.header}>Notifications</Text>
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notificationsList}
            ListEmptyComponent={<Text style={styles.emptyText}>No notifications for today!</Text>}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05, // 5% of screen width
    paddingTop: height * 0.03, // Slight padding to space out from SafeAreaView
    paddingBottom: height * 0.02, // 2% of screen height
  },
  header: {
    fontSize: width * 0.06, // 6% of screen width
    fontWeight: "bold",
    color: "#fff",
    marginBottom: height * 0.03, // 3% of screen height
    textAlign: "center",
  },
  notificationsList: {
    flexGrow: 1,
  },
  notificationItem: {
    backgroundColor: "#E5E7EB",
    marginVertical: height * 0.01, // 1% of screen height
    padding: width * 0.04, // 4% of screen width
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationText: {
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: "bold",
    color: "#1F2937",
  },
  notificationDueDate: {
    fontSize: width * 0.035, // 3.5% of screen width
    color: "#9CA3AF",
  },
  emptyText: {
    textAlign: "center",
    fontSize: width * 0.045, // 4.5% of screen width
    color: "#fff",
    marginTop: height * 0.03, // 3% of screen height
  },
});

export default Logs;
