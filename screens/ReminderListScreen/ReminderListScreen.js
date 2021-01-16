import React, { useState, useEffect } from 'react';
import { Button, Text, View, SafeAreaView, ScrollView, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js';
import { getAllReminders, removeReminderViaNotifId } from '$lib/storage';
import hdate from 'human-date'; // See: https://www.npmjs.com/package/human-date
import { recurringDate } from '$lib/recurring-friendly-date.js';
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';

export default function ReminderListScreen({ navigation }) {
    const [reminderList, setReminderList] = useState(null);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            (async () => {
                const storedReminders = await getAllReminders();
                setReminderList(sortList(storedReminders));
            })();
        }
    }, [isFocused]);

    function sortList(reminderList) {
        if (!reminderList.length) { return []; }
        const now = new Date();
        const upcomingReminders = [];
        const doneReminders = [];
        const recurringReminders = [];
        reminderList.forEach((r) => {
            if (r.recurring) {
                recurringReminders.push(r);
            }
            else {
                if (now.getTime() > r.dateTime) { // done
                    doneReminders.push(r);
                }
                else { // upcoming
                    upcomingReminders.push(r);
                }
            }
        });
        doneReminders.reverse();
        return [...upcomingReminders, ...recurringReminders, ...doneReminders];
    }


    return (
        <MinaliContainer>
            {(() => {
                if (reminderList === null) {
                    return (<Text style={[globalStyles.defaultTextColor, styles.secondaryText, { fontStyle: 'italic', padding: 30, textAlign: 'center' }]}>Loading list...</Text>);
                }
                const now = new Date();
                if (reminderList.length) {
                    return (
                        <>
                            <Text style={[globalStyles.headerText, { padding: 10, paddingBottom: 20 }]}>Upcoming Reminders 🚀</Text>
                            {reminderList.map((r) => (
                                <View
                                    key={r.notificationId}
                                    style={[styles.listItem, { opacity: (now.getTime() > r.dateTime && !r.recurring) ? 0.5 : 1 }]}
                                >
                                    <Text style={[globalStyles.defaultTextColor, styles.primaryText, { paddingBottom: 10 }]}>{r.reminder}</Text>
                                    {
                                        (r.recurring)
                                            ? <Text style={[globalStyles.defaultTextColor, styles.secondaryText]}>{(r.recurring) ? `♻️ Recurring ${r.recurring}` : ''}</Text>
                                            : <Text style={[globalStyles.defaultTextColor, styles.secondaryText]}>{'⌛' + hdate.relativeTime(new Date(r.dateTime), { presentText: 'today' })}</Text>
                                    }
                                    {
                                        (r.recurring)
                                            ? <Text style={[globalStyles.defaultTextColor, styles.secondaryText]}>{recurringDate(r)}</Text>
                                            : <Text style={[globalStyles.defaultTextColor, styles.secondaryText]}>{hdate.prettyPrint(new Date(r.dateTime), { showTime: true })}</Text>
                                    }
                                    <View style={styles.listItemControlsCon}>
                                        <Button
                                            color="#000"
                                            title="🗑️ Delete"
                                            onPress={() => {
                                                Alert.alert("Delete Reminder", "Are you sure you want to delete this reminder?", [
                                                    {
                                                        text: 'Cancel',
                                                        onPress: () => { }
                                                    },
                                                    {
                                                        text: 'Delete',
                                                        onPress: async () => {
                                                            await removeReminderViaNotifId(r.notificationId);
                                                            await Notifications.cancelScheduledNotificationAsync(r.notificationId);
                                                            const storedReminders = await getAllReminders();
                                                            setReminderList(sortList(storedReminders));
                                                        }
                                                    }
                                                ], { cancelable: false });
                                            }}
                                        />
                                    </View>
                                </View>
                            ))}
                        </>
                    );
                }
                else {
                    return (
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableOpacity
                                style={{ padding: 20, borderRadius: 100, backgroundColor: '#ccc', width: 100, height: 100 }}
                                onPress={() => navigation.navigate('SetReminder')}
                            >
                                <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 40, textAlign: 'center' }}>+</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }
            })()}
        </MinaliContainer>
    );
}

const styles = StyleSheet.create({
    listItem: {
        padding: 10,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#4B5564'
    },
    textPadding: {
        padding: 2
    },
    primaryText: {
        fontSize: 20,
        color: '#fff'
    },
    secondaryText: {
        color: '#ccc'
    },
    listItemControlsCon: {
        marginTop: 5,
        padding: 8
    }
});