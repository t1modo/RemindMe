import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../components/FirebaseConfig';
import { getAuth } from 'firebase/auth';

// Get device dimensions
const { width, height } = Dimensions.get('window');

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
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);
      if (notificationsEnabled) {
        fetchAndNotify(currentUser.uid); // Fetch tasks if notifications are enabled
      }
    } else {
      console.log('No user logged in');
    }
  }, [notificationsEnabled]); // Re-run when notificationsEnabled changes

  const fetchAndNotify = async (userId) => {
    const tasksRef = collection(db, 'users', userId, 'tasks');
    const q = query(tasksRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const today = new Date();
      today.setDate(today.getDate() - 1); // Set to one day before
      today.setHours(0, 0, 0, 0); // Normalize time to start of the day

      const todayNotifications = [];

      snapshot.forEach((doc) => {
        const task = doc.data();

        // Convert task due date to a Date object
        const taskDueDate = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);

        // Normalize taskDueDate to start of the day
        taskDueDate.setHours(0, 0, 0, 0);

        // Check if the task is due on the adjusted "today" (one day before)
        if (taskDueDate.getTime() === today.getTime()) {
          todayNotifications.push({ id: doc.id, ...task });
          if (notificationsEnabled) {
            sendLocalNotification(task.assignmentName);
          }
        }
      });

      setNotifications(todayNotifications); // Update state with today's notifications
    });

    return unsubscribe;
  };

  const sendLocalNotification = (assignmentName) => {
    if (!notificationsEnabled) return; // Prevent notifications if disabled
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Assignment Due Today 📌',
        body: `Your assignment "${assignmentName}" is due today!`,
      },
      trigger: null, // Immediate notification
    });
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled((prev) => {
      const newValue = !prev;
      Alert.alert(
        'Notifications',
        `Notifications have been ${newValue ? 'enabled' : 'disabled'}.`
      );
      return newValue;
    });
  };

  return (
    <LinearGradient
      colors={['#40916c', '#52b788', '#74c69d']}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.header}>Notifications</Text>

          {/* Toggle Notifications */}
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Enable Notifications:</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              thumbColor={notificationsEnabled ? '#2d6a4f' : '#FF4500'}
              trackColor={{ false: '#FF6347', true: '#90EE90' }}
            />
          </View>

          {/* Notifications List */}
          <FlatList
            data={notifications}
            renderItem={({ item }) => (
              <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>
                  {item.assignmentName} (Class: {item.class})
                </Text>
                <Text style={styles.notificationDueDate}>Due Today</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notificationsList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No notifications for today!</Text>
            }
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
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.02,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.02,
  },
  label: {
    fontSize: width * 0.045,
    color: '#fff',
  },
  notificationsList: {
    flexGrow: 1,
  },
  notificationItem: {
    backgroundColor: '#E5E7EB',
    marginVertical: height * 0.01,
    padding: width * 0.04,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationText: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  notificationDueDate: {
    fontSize: width * 0.035,
    color: '#9CA3AF',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: width * 0.045,
    color: '#fff',
    marginTop: height * 0.03,
  },
});

export default Logs;
