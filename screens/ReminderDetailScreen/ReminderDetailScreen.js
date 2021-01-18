import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js'
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';
import { getReminderByNotifId, updateReminderByNotifId } from '$lib/storage';
import { schedNotif } from '$lib/notif.js';

export default function ReminderDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [reminderDetails, setReminderDetails] = useState(false);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused && id) {
            (async () => {
                setReminderDetails(await getReminderByNotifId(id));
            })();
        }
    }, [isFocused]);

    if (!id) { return null; }

    async function snooze() {
        if (reminderDetails && !reminderDetails.recurring) {
            const oldNotificationId = reminderDetails.notificationId;
            const now = new Date();
            const TEN_MINUTES = 600; // seconds
            now.setSeconds(now.getSeconds() + TEN_MINUTES);
            const notificationId = await schedNotif({
                content: {
                    title: "Reminder",
                    body: reminderDetails.reminder,
                },
                trigger: now
            });
            reminderDetails.notificationId = notificationId;
            reminderDetails.dateTime = now.getTime();
            await updateReminderByNotifId(oldNotificationId, reminderDetails);
            navigation.navigate('ReminderList'); 
        }
    }

    return (
        <MinaliContainer>
            <View style={{ marginTop: 20, padding: 10 }}>
                {(() => {
                    if (reminderDetails === false) {
                        return (
                            <Text style={[globalStyles.defaultTextColor, { textAlign: 'center', fontStyle: 'italic' }]}>Loading...</Text>
                        );
                    }
                    if (reminderDetails) {
                        return (
                            <Text style={[globalStyles.defaultTextColor, { textAlign: 'center', fontSize: 30 }]}>{reminderDetails.reminder}</Text>
                        );
                    }
                    else {
                        return (
                            <Text style={[globalStyles.defaultTextColor, { textAlign: 'center', color: '#ccc' }]}>No reminder found.</Text>
                        );
                    }
                })()}
                <View style={{ flex: 1, justifyContent: 'center', marginTop: 20 }}>
                    {! reminderDetails.recurring && <TouchableOpacity
                        style={styles.button}
                        onPress={snooze}
                    >
                        <Text style={styles.buttonText}>Snooze for 10 min</Text>
                    </TouchableOpacity>}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('ReminderList')}
                    >
                        <Text style={styles.buttonText}>Dismiss</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </MinaliContainer>
    );
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 20,
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