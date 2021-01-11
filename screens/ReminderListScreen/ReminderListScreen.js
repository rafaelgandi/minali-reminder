import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
// See: https://blog.jscrambler.com/how-to-use-react-native-asyncstorage/
import AsyncStorage from '@react-native-community/async-storage';
import globalStyles from '$styles/Global.styles.js'

export default function ReminderListScreen({ navigation }) { 
    const [reminderList, setReminderList] = useState([]);
    useEffect(() => {
        (async () => {
            const storedReminders = await AsyncStorage.getItem('MinaliReminders@list');
            if (storedReminders) {
                setReminderList(JSON.parse(storedReminders));
            }
        })();
    }, []);

    
    // (2021-01-10) rTODO: List reminders from storage here


    return (
        <SafeAreaView style={[globalStyles.container, {paddingTop: 60}]}>
            <ScrollView>
            <Text style={globalStyles.defaultTextColor}>Reminders</Text>
            {reminderList.map((r) => (
                <View key={r.notificationId} style={{marginTop: 20, padding: 10, backgroundColor: '#000', marginBottom: 30, borderRadius: 5}}>
                    <Text style={[globalStyles.defaultTextColor, {padding: 3}]}>{r.reminder}</Text>
                    <Text style={[globalStyles.defaultTextColor, {padding: 3}]}>{(new Date(r.dateTime)).toLocaleString()}</Text>
                    <Text style={[globalStyles.defaultTextColor, {padding: 3}]}>{r.notificationId}</Text> 
                </View>
            ))}
            </ScrollView>
        </SafeAreaView>
    );
}