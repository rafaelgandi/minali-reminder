import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
// See: https://blog.jscrambler.com/how-to-use-react-native-asyncstorage/
import AsyncStorage from '@react-native-community/async-storage';
import globalStyles from '$styles/Global.styles.js'

export default function ReminderDetailScreen({ route, navigation }) { 


    
    // (2021-01-10) rTODO: List reminders from storage here

    const {reminderText, notificationId} = route.params;

    if (!notificationId) { return null; } 


    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.defaultTextColor}>{reminderText} - {notificationId}</Text>
        </View>
    );
}