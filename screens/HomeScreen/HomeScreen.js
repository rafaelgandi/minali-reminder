
import React, { useEffect, useReducer, useRef, useContext } from 'react';
import { StyleSheet, Text, View, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js'
import styles from './HomeScreen.styles';
import parse from '$lib/time-parser.js';
import { storeNewReminder } from '$lib/storage.js'
import hdate from 'human-date';
import { Picker } from '@react-native-picker/picker';
import { schedNotif } from '$lib/notif.js';
import { isToday } from '$lib/helpers.js';
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';
import routes from '$lib/routes.js';
import useNotificationRecieved from '$lib/useNotificationRecieved.js';
import LottieView from 'lottie-react-native';
import { Entypo } from '@expo/vector-icons';  // See: https://docs.expo.io/guides/icons/
import Suggestion from '$components/Suggestion/Suggestion';
import { storeReminderSuggestion } from '$lib/suggestion-objects.js';

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
    recurring: null,
    displayRecentReminder: false,
    labelColor: 'labelNormal',

    showSuggestion: false,
    suggestionCompareText: '',
    suggestionType: null
};

let reminderTextThrottle = null,
    whenTextThrottle = null,
    throttleTimeout = 400,
    showKeyboard;

export default function HomeScreen({ route, navigation }) {
    const [state, dispatcher] = useReducer(reducer, initialState);
    const isFocused = useIsFocused();
    const reminderTextRef = useRef(null);
    const buttonAnimRef = useRef(null);
    const { reminderText } = (route.params) ? route.params : {};
    useNotificationRecieved((notificationId) => {
        clearTimeout(showKeyboard);
        isFocused && navigation.navigate(routes.reminderDetail, { id: notificationId, fromNotificationTap: true });
    });

    useEffect(() => {
        if (isFocused && reminderTextRef.current) {
            if (reminderText) {
                initialState.reminderText = reminderText;
                navigation.setParams({ reminderText: null }); // reset params
            }
            else {
                initialState.reminderText = '';
            }
            dispatcher({ value: initialState });
            showKeyboard = setTimeout(() => {
                reminderTextRef.current.focus();
            }, 200);
        }
    }, [isFocused]);

    async function scheduleNotification(date) {
        if (!date) {
            dispatcher({
                value: {
                    infoText: 'No reminder date and time set.',
                    labelColor: 'labelBad'
                }
            });
            return;
        }
        if (!state.reminderText.trim()) {
            dispatcher({
                value: {
                    infoText: 'Please set your reminder first.',
                    labelColor: 'labelBad'
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
                title: "🔔 Reminder",
                body: state.reminderText.trim(),
            },
            trigger
        });

        console.log(notificationId);
        return notificationId;
    }

    function playBellAnim() {
        if (buttonAnimRef.current) {
            buttonAnimRef.current.reset();
            buttonAnimRef.current.play();
            setTimeout(() => {
                buttonAnimRef.current.reset();
            }, 800);
        }
    }

    function onSetReminder() {
        if (!state.reminderText.trim()) { return; }
        let date = parseText(state.whenText, true);

        if (!date) {
            date = parseText(state.reminderText);
        }
        if (date) {
            playBellAnim();
            (async () => {
                const notificationId = await scheduleNotification(date);
                await storeNewReminder({
                    reminder: state.reminderText,
                    dateTime: date.getTime(),
                    recurring: (state.recurring) ? state.recurring : false,
                    notificationId: notificationId,
                    whenText: state.whenText
                });

                // LM: 2021-06-11 09:13:08 [Store reminder for later suggestion]
                storeReminderSuggestion(state.reminderText.trim());

                dispatcher({
                    value: {
                        reminderText: '',
                        whenText: '',
                        parsedReminderDateTime: null,
                        infoText: `Reminder set for ${(isToday(date)) ? 'today, ' : ''}${hdate.prettyPrint(date, { showTime: true })}`,
                        labelColor: 'labelGood',
                        recurring: null,
                        showSuggestion: false,
                        suggestionCompareText: '',
                        suggestionType: null
                    }
                });
                setTimeout(() => {
                    reminderTextRef.current.focus();
                }, 500);             
                //Keyboard.dismiss();
            })();
        }
    }

    function parseText(text, showUnableToParse = true) {
        if (!text.trim()) { return; }
        let prasedReminder = parse(text);
        if (prasedReminder.startDate) {
            // console.log(prasedReminder);
            dispatcher({
                value: {
                    parsedReminderDateTime: prasedReminder.startDate,
                    infoText: `Set for ${(isToday(prasedReminder.startDate)) ? 'today, ' : ''}${hdate.prettyPrint(prasedReminder.startDate, { showTime: true })}`,
                    labelColor: 'labelNormal'
                }
            });
            return prasedReminder.startDate;
        }
        else {
            showUnableToParse && dispatcher({
                value: {
                    parsedReminderDateTime: null,
                    infoText: 'Unable to determine the time for the reminder.',
                    labelColor: 'labelBad'
                }
            });

            return;
        }
    }
    return (
        <MinaliContainer>
            {/* Suggestion bubble */}
            <Suggestion
                show={state.showSuggestion}
                compareText={state.suggestionCompareText}
                suggestionType={state.suggestionType}
                onClose={() => {
                    dispatcher({
                        value: {
                            showSuggestion: false,
                            suggestionCompareText: '',
                            suggestionType: null
                        }
                    });
                }}
                onSelect={(match) => {
                    if (state.suggestionCompareText === state.reminderText) {
                        dispatcher({
                            value: {
                                reminderText: match
                            }
                        });
                    }
                    else {
                        dispatcher({
                            value: {
                                whenText: match
                            }
                        });
                    }
                }}
            />

            {/* Submit Button */}
            <View style={{ width: '100%', paddingBottom: 40, marginTop: 20 }}>
                <TouchableOpacity
                    style={{
                        padding: 5,
                        backgroundColor: '#000',
                        position: 'absolute',
                        right: 20,
                        borderRadius: 3,
                        paddingLeft: 15,
                        paddingRight: 15,
                        elevation: 5
                    }}
                    onPress={onSetReminder}
                >
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <LottieView
                            ref={animation => {
                                buttonAnimRef.current = animation;
                            }}
                            style={{
                                width: 30,
                                height: 30
                            }}
                            speed={3}
                            autoPlay={false}
                            source={require('./bellWhite.json')}
                        // See: https://github.com/lottie-react-native/lottie-react-native/blob/master/docs/api.md
                        />
                        <Text style={[styles.buttonText, { paddingLeft: 5, paddingRight: 5 }]}>Save</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Reminder Text */}
            <TextInput
                style={styles.textArea}
                placeholder="Remind me about..."
                placeholderTextColor="#ccc"
                selectTextOnFocus={true}
                multiline
                autoFocus={true}
                ref={reminderTextRef}
                value={state.reminderText}
                onChangeText={(text) => {
                    dispatcher({ value: { reminderText: text, showSuggestion: false } });
                    clearTimeout(reminderTextThrottle);
                    reminderTextThrottle = setTimeout(() => {
                        parseText(text, false);
                        dispatcher({
                            value: {
                                showSuggestion: true,
                                suggestionCompareText: text,
                                suggestionType: 'reminders'
                            }
                        });
                    }, throttleTimeout);
                }}
            />

            {/* When Text */}
            <View>
                <View style={styles.dateConfirmerCon}>
                    {state.infoText
                        ? <Text style={[styles.dateConfirmerText, styles[state.labelColor]]}>
                            <Entypo name="calendar" size={10} /> {state.infoText}
                        </Text>
                        : null}
                </View>
            </View>
            <TextInput
                style={styles.whenTextInput}
                placeholder="When?"
                placeholderTextColor="#ccc"
                selectTextOnFocus={true}
                multiline
                value={state.whenText}
                onChangeText={(text) => {
                    dispatcher({
                        value: {
                            whenText: text,
                            infoText: '',
                            showSuggestion: false
                        }
                    });
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
                        parseText(text, false);
                        dispatcher({
                            value: {
                                showSuggestion: true,
                                suggestionCompareText: text,
                                suggestionType: 'when'
                            }
                        });
                    }, throttleTimeout);
                }}
            />

            {/* Recurring Select box */}
            <View style={styles.recurringPickerCon}>
                <Picker
                    selectedValue={(state.recurring) ? state.recurring : '`no_recurring`'}
                    style={styles.recurrPicker}
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
        </MinaliContainer>
    );
}
