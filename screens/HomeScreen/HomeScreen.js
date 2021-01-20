
import React, { useEffect, useReducer, useRef } from 'react';
import { StyleSheet, Text, View, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js'
import Sherlock from 'sherlockjs';
import { storeNewReminder } from '$lib/storage'
import hdate from 'human-date';
import { Picker } from '@react-native-picker/picker';
import { schedNotif } from '$lib/notif.js';
import { isToday } from '$lib/helpers.js';
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';
import RecentReminder from '$components/RecentReminder/RecentReminder';

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

let reminderTextThrottle = null,
    whenTextThrottle = null,
    doneThrottle = null,
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

        const trigger = (() => {
            if (!state.recurring) {
                return date;
            }
            // For recurring reminders below. Currently I only support daily or weekly
            let tObj = {
                repeats: true,
                hour: date.getHours(),
                minute: date.getMinutes()
            };
            if (state.recurring === 'weekly') {
                tObj.weekday = date.getDay() + 1
            }
            return tObj;
        })();

        // Schedule the notification
        let notificationId = await schedNotif({
            content: {
                title: "Reminder",
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
                    recurring: (state.recurring) ? state.recurring : false,
                    notificationId: notificationId
                });
                dispatcher({
                    value: {
                        reminderText: '',
                        whenText: '',
                        parsedReminderDateTime: null,
                        infoText: `Reminder set for ${(isToday(date)) ? 'today,' : ''} ${hdate.prettyPrint(date, { showTime: true })}`,
                        recurring: null
                    }
                });
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
                    infoText: `Set for ${(isToday(prasedReminder.startDate)) ? 'today,' : ''} ${hdate.prettyPrint(prasedReminder.startDate, { showTime: true })}`
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
        <MinaliContainer>
            <View style={{ width: '100%', paddingBottom: 40, marginTop:20 }}>
                <TouchableOpacity
                    style={{
                        padding: 5,
                        backgroundColor: '#000',
                        position: 'absolute',
                        right: 20,
                        borderRadius: 3,
                        paddingLeft: 15,
                        paddingRight: 15,
                    }}
                    onPress={onSetReminder}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.textArea}
                placeholder="Remind me about..."
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
                                    infoText: ''
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
                    <Picker.Item label="Daily" value="daily" />
                    <Picker.Item label="Weekly" value="weekly" />
                </Picker>
            </View>
            <View style={styles.dateConfirmerCon}>
                {state.infoText ? <Text style={styles.dateConfirmerText}>{state.infoText}</Text> : null}
            </View>

            <RecentReminder />
            
        </MinaliContainer>
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
        marginTop: 10,
        padding: 3,
        marginLeft: 10,
        marginRight: 10
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
        marginTop: 10,
        padding: 3,
        paddingLeft: 10
    }
});