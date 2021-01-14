
import React, { useEffect, useReducer, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js'
import Sherlock from 'sherlockjs';
import { storeNewReminder } from '$lib/storage'
import hdate from 'human-date';
import { Picker } from '@react-native-picker/picker';
import { schedNotif } from '$lib/notif.js';

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
    infoText: '',
    recurring: null
};
const numberOfSeconds = {
    '1min': 60,
    'daily': 86400,
    'weekly': 604800,
    'monthly': 2628000,
    'yearly': 31540000
};

let reminderTextThrottle = null,
    whenTextThrottle = null,
    throttleTimeout = 600;

export default function HomeScreen({ navigation }) {
    const [state, dispatcher] = useReducer(reducer, initialState);
    const isFocused = useIsFocused();
    const reminderTextRef = useRef(null);
    useEffect(() => {
        if (isFocused && reminderTextRef.current) {
            dispatcher({ value: initialState });
            reminderTextRef.current.focus();

        }
    }, [isFocused]);

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
        let notificationId = await schedNotif({
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
        if (!state.reminderText.trim()) { return; }
        let date = parseText(state.whenText);

        if (!date) {
            date = parseText(state.reminderText);
        }
        if (date) {
            dispatcher({
                value: {
                    infoText: `Set for ${hdate.prettyPrint(date, { showTime: true })}`
                }
            });
            (async () => {
                const notificationId = await scheduleNotification(date);
                await storeNewReminder({
                    reminder: state.reminderText,
                    dateTime: date.getTime(),
                    recurring: (state.recurring) ? numberOfSeconds[state.recurring] : false,
                    notificationId: notificationId
                });
                dispatcher({
                    value: {
                        reminderText: '',
                        whenText: '',
                        parsedReminderDateTime: null,
                        infoText: `Reminder set for ${hdate.prettyPrint(date, { showTime: true })}`,
                        recurring: null
                    }
                });
                setTimeout(() => {
                    dispatcher({ value: { infoText: '' } });
                }, 2e3);
                Keyboard.dismiss();
            })();

        }
    }

    function parseText(text, showUnableToParse = true) {
        if (!text.trim()) { return; }
        let prasedReminder = Sherlock.parse(text);
        if (prasedReminder.startDate) {
            // console.log(prasedReminder);
            dispatcher({
                value: {
                    parsedReminderDateTime: prasedReminder.startDate,
                    //infoText: `Set for ${prasedReminder.startDate.toLocaleString()}`
                    infoText: `Set for ${hdate.prettyPrint(prasedReminder.startDate, { showTime: true })}`
                }
            });
            return prasedReminder.startDate;
        }
        else {
            showUnableToParse && dispatcher({
                value: {
                    parsedReminderDateTime: null,
                    infoText: 'Unable to determine the time for the reminder.'
                }
            });
            return;
        }
    }

    return (
        <View style={[globalStyles.container, { paddingTop: 30 }]}>
            <TextInput
                style={styles.textArea}
                placeholder="Reminder..."
                placeholderTextColor="#ccc"
                multiline
                autoFocus={true}
                ref={reminderTextRef}
                value={state.reminderText}
                onChangeText={(text) => {
                    dispatcher({ value: { reminderText: text } });
                    clearTimeout(reminderTextThrottle);
                    reminderTextThrottle = setTimeout(() => {
                        parseText(text, false);
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
                    dispatcher({ value: { whenText: text } });
                    clearTimeout(whenTextThrottle);
                    whenTextThrottle = setTimeout(() => {
                        if (!text.trim()) {
                            dispatcher({
                                value: {
                                    parsedReminderDateTime: null,
                                    infoText: 'Unable to determine the time for the reminder.'
                                }
                            });
                            return;
                        }
                        parseText(text);
                    }, throttleTimeout);
                }}
            />
            <View style={styles.recurringPickerCon}>
                <Picker
                    selectedValue={(state.recurring) ? state.recurring : '`no_recurring`'}
                    style={{ height: 20, width: 300, color: '#ccc'}} 
                    onValueChange={(itemValue, itemIndex) => {
                        if (itemValue === 'no_recurring') {
                            dispatcher({
                                value: {
                                    recurring: null
                                }
                            });
                            return; 
                        }
                        dispatcher({
                            value: {
                                recurring: itemValue
                            }
                        });
                    }}>
                    <Picker.Item label="One Time" value="no_recurring" />
                    <Picker.Item label="Every 1 minute" value="1min" />
                    <Picker.Item label="Daily" value="daily" />
                    <Picker.Item label="Weekly" value="weekly" />
                    <Picker.Item label="Monthly" value="monthly" />
                    <Picker.Item label="Yearly" value="yearly" />
                </Picker>
            </View>
            <View style={styles.dateConfirmerCon}>
                {state.infoText ? <Text style={styles.dateConfirmerText}>{state.infoText}</Text> : null}
            </View>

            <View style={{ marginTop: 5, width: '100%', flex: 1, alignItems: 'center' }}>
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
        padding: 15, 
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
        color: '#fff',
        backgroundColor: '#ED864D',
        padding: 3,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    },
    recurringPickerCon: {
        marginTop: 5,
        padding: 3
    }
});