
import React, { useEffect, useReducer } from 'react';
import { StyleSheet, Text, View, Alert, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import globalStyles from '$styles/Global.styles.js'
import Sherlock from 'sherlockjs';
import { storeNewReminder } from '$lib/storage'

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
    parsedReminderDateTime: null,
    infoText: ''
};

let reminderTextThrottle = null,
    whenTextThrottle = null,
    throttleTimeout = 600;

export default function HomeScreen({ navigation }) {
    const [state, dispatcher] = useReducer(reducer, initialState);

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            //const url = response.notification.request.content.data.url;

            console.log(response.notification.request.content);
            console.log(response.notification.request.identifier);

            navigation.navigate('ReminderDetail', {
                reminderText: response.notification.request.content.body,
                notificationId: response.notification.request.identifier
            });

            // Let React Navigation handle the URL
            //console.log(url);
        });
        return () => {
            subscription.remove();
        };
    }, [navigation]);

    async function scheduleNotification(date) {
        if (!date) {
            dispatcher({
                value: {
                    infoText: 'No reminder date and time set.'
                }
            });
            return;
        }
        if (!state.reminderText.trim()) {
            dispatcher({
                value: {
                    infoText: 'Please set your reminder first.'
                }
            });
            return;
        }
        const trigger = date;

        if (!('scheduleNotificationAsync' in Notifications)) {
            console.log('web does not support notification');
            return 'web-no-notification';
        }

        // See: https://dev.to/chakrihacker/react-native-local-notifications-in-expo-24cm
        let notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Minali Reminder",
                body: state.reminderText.trim(),
            },
            trigger
        });

        console.log(notificationId);
        return notificationId;
    }

    function onSetReminder() {
        //console.log(state);
        if (!state.reminderText.trim()) { return; }
        let date = parseText(state.whenText);

        if (!date) {
            date = parseText(state.reminderText);
        }

        if (date) {
            // console.log(prasedReminder);
            dispatcher({
                value: {
                    infoText: `Reminder will be on ${date.toLocaleString()}`
                }
            });
            (async () => {
                const notificationId = await scheduleNotification(date);
                await storeNewReminder({
                    reminder: state.reminderText,
                    dateTime: date.getTime(),
                    recurring: false,
                    notificationId: notificationId
                }); 
                dispatcher({
                    value: {
                        reminderText: '',
                        whenText: '',
                        parsedReminderDateTime: null,
                        infoText: `Reminder set for ${date.toLocaleString()}`
                    }
                });
                Keyboard.dismiss();
            })();

        }
        else {
            dispatcher({
                value: {
                    parsedReminderDateTime: null,
                    infoText: 'I can\'t seem to determine the time for the reminder.'
                }
            })
        }
    }

    function parseText(text) {
        if (!text.trim()) { return; }
        let prasedReminder = Sherlock.parse(text);
        if (prasedReminder.startDate) {
            // console.log(prasedReminder);
            dispatcher({
                value: {
                    parsedReminderDateTime: prasedReminder.startDate,
                    infoText: `Reminder will be on ${prasedReminder.startDate.toLocaleString()}`
                }
            });
        }
        return prasedReminder.startDate;
    }

    return (
        <View style={[globalStyles.container, { paddingTop: 80 }]}>
            <TextInput
                style={styles.textArea}
                placeholder="Reminder..."
                placeholderTextColor="#ccc"
                multiline
                autoFocus={true}
                value={state.reminderText}
                onChangeText={(text) => {
                    dispatcher({ value: { reminderText: text } }); 
                    clearTimeout(reminderTextThrottle);                   
                    reminderTextThrottle = setTimeout(() => {
                        parseText(text);
                    }, throttleTimeout);
                }}
            />
            <TextInput
                style={styles.whenTextInput}
                placeholder="When?"
                placeholderTextColor="#ccc"
                multiline
                value={state.whenText}
                onChangeText={(text) => {
                    dispatcher({ value: { whenText: text }});
                    clearTimeout(whenTextThrottle);
                    whenTextThrottle = setTimeout(() => {
                        parseText(text);
                    }, throttleTimeout);
                }}
            />
            <View style={styles.dateConfirmerCon}>
                <Text style={styles.dateConfirmerText}>{state.infoText}</Text>
            </View>

            <View style={{ marginTop: 10, width: '100%', flex: 1, alignItems: 'center' }}>
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={onSetReminder}
                >
                    <Text style={styles.buttonText}>Done</Text>
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
        borderRadius: 3,
        width: '80%'
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#fff',
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