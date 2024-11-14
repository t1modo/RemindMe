import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // This is for Expo's vector icons
import { Calendar } from 'react-native-calendars'; // Import Calendar component

// Helper function to sort tasks by due date (closest date at top)
const sortTasksByDueDate = (tasks) => {
    return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
};

// Helper function to format date in MM/DD/YYYY
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month and ensure it's 2 digits
    const day = (date.getDate() + 1).toString().padStart(2, '0'); // Get day and ensure it's 2 digits
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false); // New state for showing calendar
    const [className, setClassName] = useState("");
    const [assignmentName, setAssignmentName] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [markedDate, setMarkedDate] = useState(''); // Track the marked date for proper bubble placement

    const handleAddTask = () => {
        // Check for duplicates based on assignment name
        const duplicateTask = tasks.some((task) => task.assignmentName === assignmentName);
        if (duplicateTask) {
            Alert.alert("Duplicate Task", "The task you are trying to add already exists.");
            return;
        }

        if (!className || !assignmentName || !dueDate) {
            Alert.alert("Error", "Please fill out all fields.");
            return;
        }

        const newTask = {
            id: `${Date.now()}`, // Unique id based on timestamp
            class: className,
            assignmentName: assignmentName,
            dueDate: dueDate,
        };

        const updatedTasks = [...tasks, newTask];
        setTasks(sortTasksByDueDate(updatedTasks)); // Sort the tasks after adding a new one

        // Reset the modal and task details for a fresh entry
        setShowModal(false);
        setClassName('');
        setAssignmentName('');
        setDueDate('');
        setMarkedDate('');
    };

    const renderItem = ({ item }) => (
        <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.class}</Text>
            <Text style={styles.taskName}>({item.assignmentName})</Text>
            <Text style={styles.dueDate}>{formatDate(item.dueDate)}</Text>
        </View>
    );

    // Handle date selection from the calendar
    const handleDateSelect = (date) => {
        const selectedDate = date.dateString; // Date is in the format YYYY-MM-DD
        setDueDate(selectedDate); // Set the selected date to state
        setMarkedDate(selectedDate); // Set the marked date for the calendar
        setShowCalendarModal(false); // Close the calendar modal after selection
    };

    useEffect(() => {
        // Update the list order when tasks are added or updated
        setTasks(sortTasksByDueDate(tasks));
    }, [tasks]);

    // Get today's date and format it to match the format used by the calendar
    const today = new Date().toISOString().split('T')[0];

    return (
        <View style={styles.container}>
            {/* Scrollable area with vertical task display */}
            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.tasksList}
            />
            
            {/* Floating Add Task Button */}
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => setShowModal(true)}
            >
                <FontAwesome name="plus-circle" size={40} color="#fff" />
            </TouchableOpacity>

            {showModal && (
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        {/* Class Label and Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Class</Text>
                            <TextInput
                                style={styles.input}
                                value={className}
                                onChangeText={setClassName}
                            />
                        </View>

                        {/* Assignment Name Label and Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Assignment Name</Text>
                            <TextInput
                                style={styles.input}
                                value={assignmentName}
                                onChangeText={setAssignmentName}
                            />
                        </View>

                        {/* Due Date Label and Calendar */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Due Date</Text>
                            <TouchableOpacity 
                                style={styles.input} 
                                onPress={() => setShowCalendarModal(true)} // Trigger calendar on press
                            >
                                <Text style={styles.inputText}>{dueDate ? formatDate(dueDate) : 'Select a date'}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Save and Cancel Buttons */}
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleAddTask}>
                                <Text style={styles.saveButtonText}>Save Task</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Calendar Popup for Due Date */}
            {showCalendarModal && (
                <View style={styles.calendarModal}>
                    <View style={styles.calendarModalContent}>
                        <Calendar
                            onDayPress={handleDateSelect}
                            markedDates={{
                                [markedDate]: { selected: true, selectedColor: '#40916C', selectedTextColor: '#fff' }, // Only the selected date should have the green bubble
                            }}
                            monthFormat={'MMMM yyyy'}
                            markingType="simple"
                            theme={{
                                textSectionTitleColor: '#000',  // Black color for the month/year text between arrows
                                arrowColor: '#40916C',  // Color of the arrows themselves
                                dayTextColor: '#000',  // This changes the day text color to black
                                selectedDayBackgroundColor: '#40916C',  // Highlighted day background color
                                selectedDayTextColor: '#ffffff',  // Selected day text color
                                todayTextColor: '#40916C',  // Today's date text color (highlighted)
                            }}
                            minDate={today} // Disable past dates
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 20,
    },
    tasksList: {
        flexGrow: 1,  // Ensures the FlatList content is scrollable
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 60,
    },
    taskText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1F2937",
        marginRight: 10,  // Space between Class and Assignment Name
    },
    taskName: {
        fontSize: 16,
        color: "#1F2937",
        marginRight: 10,  // Space between Assignment Name and Due Date
    },
    dueDate: {
        fontSize: 14,
        color: "#9CA3AF",
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#40916C",  // Updated to new green color
        borderRadius: 50,
        padding: 15,
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
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        color: "#333",
    },
    inputText: {
        fontSize: 16,
        color: "#333",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    saveButton: {
        backgroundColor: "#40916C", // Updated to new green color
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
    calendarModal: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    calendarModalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    closeCalendarButton: {
        marginTop: 20,
        backgroundColor: "#40916C", // Updated to new green color
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    closeCalendarButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Tasks;
