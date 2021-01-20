import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js'
import { getAllReminders } from '$lib/storage';
import { snooze, isToday } from '$lib/helpers.js';

export default function RecentReminder() {

    const [reminderDetails, setReminderDetails] = useState(false);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            (async () => {
                const storedReminders = await getAllReminders();
                setReminderDetails(getRecentReminder(storedReminders));
            })();
        }
    }, [isFocused]);

    function getRecentReminder(list) {
        if (!list.length) { return null; }
        const doneRemindersAndIsToday = [];
        const now = new Date();
        list.forEach((r) => {
            if (!r.recurring) {
                if (now.getTime() > r.dateTime && isToday(new Date(r.dateTime))) {
                    doneRemindersAndIsToday.push(r);
                }
            }
        });
        if (!doneRemindersAndIsToday.length) { return null; }
        return doneRemindersAndIsToday.pop();
    }


    async function onSnooze() {
        if (reminderDetails && !reminderDetails.recurring) {
            await snooze(reminderDetails);
            const storedReminders = await getAllReminders();
            setReminderDetails(getRecentReminder(storedReminders));
        }
    }

    if (reminderDetails === null) {
        return null;
    }

    return (
        <View style={styles.container}>
            {(() => {
                if (reminderDetails === false) {
                    return (
                        <Text style={[globalStyles.defaultTextColor, { textAlign: 'center', fontStyle: 'italic' }]}>Loading...</Text>
                    );
                }
                if (reminderDetails) {
                    return (
                        <>
                            <Text style={[globalStyles.defaultTextColor, { textAlign: 'center', fontSize: 15, color: '#ccc', opacity: 0.5, marginBottom: 10 }]}>Recent Reminder</Text>
                            <Text style={[globalStyles.defaultTextColor, { textAlign: 'center', fontSize: 20 }]}>{reminderDetails.reminder}</Text>
                            <View style={{ flex: 1, justifyContent: 'center', marginTop: 10 }}>
                                {!reminderDetails.recurring && <TouchableOpacity
                                    style={styles.button}
                                    onPress={onSnooze}
                                >
                                    <Text style={styles.buttonText}>Remind me again in 10 min</Text>
                                </TouchableOpacity>}
                            </View>
                        </>
                    );
                }

            })()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        marginTop: 10, 
        padding: 10, 
        paddingTop: 20,
        marginLeft: 20, 
        marginRight: 20 
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold'
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 3,
        paddingLeft: 15,
        paddingRight: 15,
    }
});