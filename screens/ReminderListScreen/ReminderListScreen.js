import React, { useState, useEffect } from 'react';
import { Button, Text, View, SafeAreaView, ScrollView, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import globalStyles from '$styles/Global.styles.js'
import { getAllReminders, removeReminderViaNotifId } from '$lib/storage'

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
        <SafeAreaView style={[globalStyles.container, { paddingTop: 60, flex: 1}]}> 
            <ScrollView style={{width: '100%'}}>
                <Text style={[globalStyles.defaultTextColor, {fontSize: 25, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'}]}>Upcoming Reminders</Text>
                {reminderList.map((r) => (
                    <View key={r.notificationId} style={{ marginTop: 10, padding: 10, backgroundColor: '#000', marginBottom: 15, borderRadius: 5, marginLeft: 5, marginRight: 5 }}>
                        <Text style={[globalStyles.defaultTextColor, { padding: 5, fontSize: 20 }]}>{r.reminder}</Text>
                        <Text style={[globalStyles.defaultTextColor, { padding: 2 }]}>{(new Date(r.dateTime)).toLocaleString()}</Text>
                        <Text style={[globalStyles.defaultTextColor, { padding: 2, fontSize: 8 }]}>{r.notificationId}</Text>
                        <Button
                            color="#FF555A"
                            title="Delete"
                            onPress={() => {
                                Alert.alert("Delete Reminder", "Are you sure you want to delete this reminder?", [
                                    {
                                        text: 'Delete',
                                        onPress: async () => {
                                            await removeReminderViaNotifId(r.notificationId);
                                            await Notifications.cancelScheduledNotificationAsync(r.notificationId);
                                            const storedReminders = await getAllReminders();
                                            setReminderList(storedReminders);
                                        }
                                    },
                                    {
                                        text: 'Cancel',
                                        onPress: () => { }
                                    }
                                ], { cancelable: false });
                            }}
                        />
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}