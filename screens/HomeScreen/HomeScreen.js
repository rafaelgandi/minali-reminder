
import React, { useEffect, useReducer } from 'react';
import { StyleSheet, Text, View, Alert, Button, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import globalStyles from '$styles/Global.styles.js'
import Sherlock from 'sherlockjs';

function reducer(state, action) {
    if (typeof action.type === 'undefined') {
        return {
            ...state,
            ...action.value
        };
    }
}
const initialState = {
    reminderText: '',
    whenText: '',
    parsedReminderDateTime: null
};

export default function HomeScreen({ navigation }) {
    const [state, dispatcher] = useReducer(reducer, initialState);
    async function fireNotification() {
        const trigger = Date.now() + 500;
        // See: https://dev.to/chakrihacker/react-native-local-notifications-in-expo-24cm
        let notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Minali Reminder",
                body: 'This is a static reminder for you',
            },
            trigger
            // trigger: {
            //     seconds: 1,
            //     repeats: false
            // }
        });

        //console.log(notificationId);
    }

    return (
        <View style={[globalStyles.container, {paddingTop: 80}]}> 
            <TextInput 
                style={styles.textArea} 
                placeholder="Reminder me..."
                placeholderTextColor="#ccc"
                multiline
                autoFocus={true} 
                value={state.reminderText}
                onChangeText={(text) => dispatcher({value: {reminderText: text}})}
            />
            <TextInput 
                style={styles.whenTextInput}  
                placeholder="When?" 
                placeholderTextColor="#ccc" 
                multiline
                value={state.whenText}
                onChangeText={(text) => dispatcher({value: {whenText: text}})}
            />
            <View style={styles.dateConfirmerCon}>
                <Text style={styles.dateConfirmerText}>{state.parsedReminderDateTime && `Reminder set on ${state.parsedReminderDateTime.toLocaleString()}`}</Text>
            </View>  

            <View style={{marginTop: 10, width:'100%'}}>         
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => {
                        console.log(state);
                        if (!state.reminderText.trim()) { return; }
                        let prasedReminder = Sherlock.parse(state.reminderText);
                        if (prasedReminder.startDate) {
                            // console.log(prasedReminder);
                            dispatcher({value: {parsedReminderDateTime: prasedReminder.startDate}}); 
                        }
                        else {
                            dispatcher({value: {parsedReminderDateTime: null}})
                        }                      
                    }}
                >
                    <Text style={styles.buttonText}>Parse Reminder Text</Text>
                </TouchableOpacity>
            </View>


            <View style={{marginTop: 10, width:'100%'}}>         
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => {
                        fireNotification();
                    }}
                >
                    <Text style={styles.buttonText}>Notify</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    textArea: { 
        minHeight: 50, 
        borderColor: 'gray', 
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        width: '90%', 
        padding: 10,
        fontSize: 20,
        margin: 10,
        color: '#fff' 
    },
    whenTextInput: {
        height: 50,
        borderColor: 'gray', 
        width: '90%', 
        padding: 10,
        fontSize: 20,
        margin: 10,
        color: '#fff',
        borderBottomColor: '#fff',
        borderBottomWidth: 1  
    },
    buttons: {
        backgroundColor: '#ccc',
        padding: 20,        
        margin: 10,
        borderRadius: 6
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color:'#fff',
        fontWeight: 'bold'
    },
    dateConfirmerCon: {
        marginTop: 5,
        padding: 3
    },
    dateConfirmerText: {
        textAlign: 'center',
        color: '#fff'
    }
});