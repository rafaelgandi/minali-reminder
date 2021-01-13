import React, { useState, useEffect } from 'react';
import { Button, Text, View, SafeAreaView, ScrollView, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import globalStyles from '$styles/Global.styles.js'
import { getAllReminders, removeReminderViaNotifId } from '$lib/storage'
import hdate from 'human-date'; // See: https://www.npmjs.com/package/human-date
const now = new Date();

export default function ReminderListScreen({ navigation }) {
    const [reminderList, setReminderList] = useState([]);
    useEffect(() => {
        (async () => {
            const storedReminders = await getAllReminders();
            if (storedReminders) {
                setReminderList(storedReminders);
            }
        })();
    });


    // (2021-01-10) rTODO: List reminders from storage here


    return (
        <SafeAreaView style={[globalStyles.container, { paddingTop: 60, flex: 1 }]}>
            <ScrollView style={{ width: '100%' }}>
                {(() => {
                    if (reminderList.length) {
                        const upcomingReminders = [];
                        const doneReminders = [];
                        reminderList.forEach((r) => {
                            if (now.getTime() > r.dateTime) { // done
                                doneReminders.push(r);
                            }
                            else { // upcoming
                                upcomingReminders.push(r);
                            }
                        });
                        return (
                            <>
                                <Text style={globalStyles.headerText}>Upcoming Reminders</Text>
                                {[...upcomingReminders, ...doneReminders].map((r) => (
                                    <View
                                        key={r.notificationId}
                                        style={[styles.listItem, { opacity: (now.getTime() > r.dateTime) ? 0.5 : 1 }]}
                                    >
                                        <Text style={[globalStyles.defaultTextColor, styles.primaryText]}>{r.reminder}</Text>
                                        <Text style={[globalStyles.defaultTextColor, styles.secondaryText]}>{hdate.relativeTime(new Date(r.dateTime), { presentText: 'today' })}</Text>
                                        <View style={styles.listItemControlsCon}>
                                            <Button
                                                color="#FF555A"
                                                title="Delete"
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
                                                                setReminderList(storedReminders);
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
                            <View style={{flex:1, alignItems: 'center', flexDirection:'row', justifyContent: 'center'}}>
                                <TouchableOpacity 
                                    style={{padding: 20, borderRadius: 100, backgroundColor: '#ccc', width:100, height: 100}} 
                                    onPress={() => navigation.navigate('SetReminder')}
                                >
                                    <Text style={{fontWeight:'bold', color: '#fff', fontSize: 40, textAlign:'center'}}>+</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }
                })()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    listItem: {
        padding: 10,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
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
        marginTop: 10
    }
});