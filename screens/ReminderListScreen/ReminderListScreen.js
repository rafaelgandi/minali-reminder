import React, { useState, useEffect } from 'react';
import { Button, Text, View, Alert, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js';
import { getAllReminders, removeReminderViaNotifId } from '$lib/storage';
import hdate from 'human-date'; // See: https://www.npmjs.com/package/human-date
import { recurringDate } from '$lib/recurring-friendly-date.js';
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';
import { removeNotification } from '$lib/notif.js';
import { isToday } from '$lib/helpers.js';
import routes from '$lib/routes.js';
import useNotificationRecievedListener from '$lib/useNotificationRecievedListener.js';


export default function ReminderListScreen({ navigation }) {
    const [reminderList, setReminderList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();
    useNotificationRecievedListener((notificationId) => {
        navigation.navigate(routes.reminderDetail, {id: notificationId, fromNotificationTap: true});
    }, isFocused);
    useEffect(() => {
        if (isFocused) {
            setIsLoading(true);
            setTimeout(() => {
                (async () => {
                    const storedReminders = await getAllReminders();
                    setReminderList(sortList(storedReminders));
                    setIsLoading(false);
                })();
            }, 400);           
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
        <MinaliContainer isLoading={isLoading}>
            {(() => {
                if (reminderList === null) {
                    return (<Text></Text>);
                }
                const now = new Date();
                if (reminderList.length) {
                    return (
                        <>
                            <Text style={[globalStyles.headerText, { padding: 10, paddingBottom: 30, width: '70%' }]}>Upcoming Reminders</Text>
                            {reminderList.map((r) => (
                                <View
                                    key={r.notificationId}
                                    style={[styles.listItem, { opacity: (now.getTime() > r.dateTime && !r.recurring) ? 0.5 : 1 }]}
                                >
                                    <View>
                                        <TouchableWithoutFeedback onPress={() => navigation.navigate(routes.reminderDetail, {id: r.notificationId})}>
                                            <View>
                                                <Text style={[globalStyles.defaultTextColor, styles.primaryText, { paddingBottom: 10 }]}>{r.reminder}</Text>
                                                {
                                                    (r.recurring)
                                                        ? <Text style={[globalStyles.defaultTextColor, styles.secondaryText]}>{(r.recurring) ? `♻️ Recurring ${r.recurring}` : ''}</Text>
                                                        : <Text style={[globalStyles.defaultTextColor, styles.secondaryText]}>{'⌛' + hdate.relativeTime(new Date(r.dateTime), { presentText: 'today' })}</Text>
                                                }
                                                {
                                                    (r.recurring)
                                                        ? <Text style={[globalStyles.defaultTextColor, styles.secondaryText]}>{recurringDate(r)}</Text>
                                                        : <Text style={[globalStyles.defaultTextColor, styles.secondaryText]}>{(isToday(new Date(r.dateTime))) ? 'Today, ' : ''}{hdate.prettyPrint(new Date(r.dateTime), { showTime: true })}</Text>
                                                }
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
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
                                                            await removeNotification(r.notificationId);
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
                                style={{ padding: 10, backgroundColor: '#000' }}
                                onPress={() => navigation.navigate(routes.setReminder)}
                            >
                                <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 15, textAlign: 'center' }}>😴 Set Reminder</Text>
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
        marginBottom: 15//,
        // borderBottomWidth: 1,
        // borderBottomColor: '#4B5564'
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