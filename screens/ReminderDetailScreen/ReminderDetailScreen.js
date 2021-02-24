import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js'
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';
import { getReminderByNotifId } from '$lib/storage';
import { snooze } from '$lib/helpers.js';
import routes from '$lib/routes.js';

export default function ReminderDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [reminderDetails, setReminderDetails] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();
    useEffect(() => {
        setIsLoading(true);
        if (isFocused && id) {
            (async () => {
                setReminderDetails(await getReminderByNotifId(id));
                setIsLoading(false);
            })();
        }
    }, [isFocused]);

    if (!id) { return null; }

    async function onSnooze() {
        if (reminderDetails && !reminderDetails.recurring) {
            await snooze(reminderDetails);
            navigation.navigate(routes.setReminder);
        }
    }

    function reSchedule() {
        if (!reminderDetails.recurring && (new Date()).getTime() >= reminderDetails.dateTime) {
            navigation.navigate(routes.setReminder, {
                reminderText: reminderDetails.reminder
            });
        }
    }

    return (
        <MinaliContainer isLoading={isLoading}>
            <View style={styles.bigCon}>
                <View style={styles.textCon}>
                    {(() => {
                        if (isLoading) {
                            return (
                                <Text style={[globalStyles.defaultTextColor, { textAlign: 'center', fontStyle: 'italic' }]}>...</Text>
                            );
                        }
                        if (reminderDetails) {
                            return (
                                <TouchableOpacity onLongPress={() => { Vibration.vibrate(100); reSchedule(); }}>
                                    <Text style={[globalStyles.defaultTextColor, { textAlign: 'center', fontSize: 30 }]}>{reminderDetails.reminder}</Text>
                                </TouchableOpacity>

                            );
                        }
                        else {
                            return (
                                <Text style={[globalStyles.defaultTextColor, { textAlign: 'center', color: '#ccc' }]}>No reminder found.</Text>
                            );
                        }
                    })()}
                </View>
                <View style={styles.buttonCon}>
                    {(() => {
                        if (!reminderDetails.recurring) {
                            if ((new Date()).getTime() >= reminderDetails.dateTime) {
                                return (
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={reSchedule}
                                    >
                                        <Text style={styles.buttonText}>Reschedule</Text>
                                    </TouchableOpacity>
                                );
                            }
                            else {
                                return (
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={onSnooze}
                                    >
                                        <Text style={styles.buttonText}>Snooze 10 min</Text>
                                    </TouchableOpacity>
                                );
                            }
                        }
                    })()}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            if (route.params.fromNotificationTap) {
                                navigation.navigate(routes.setReminder);
                            }
                            else {
                                navigation.navigate(routes.reminderList);
                            }
                        }}
                    >
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </MinaliContainer>
    );
}

const styles = StyleSheet.create({
    bigCon: {
        flex: 1,
        marginTop: 30,
        padding: 10
    },
    textCon: {
        flex: 1
    },
    buttonCon: {
        flex: 0,
        justifyContent: 'center',
        marginTop: 20,
        flexDirection: 'row'
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold'
    },
    button: {
        margin: 10,
        marginTop: 20,
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 3,
        paddingLeft: 15,
        paddingRight: 15,
        elevation: 8
    }
});