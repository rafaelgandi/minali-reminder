
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Button, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import globalStyles from '$styles/Global.styles.js'

export default function HomeScreen({ navigation }) {
    async function fireNotification() {
        const trigger = Date.now() + 500;
        // See: https://dev.to/chakrihacker/react-native-local-notifications-in-expo-24cm
        let notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Minali Reminder",
                body: 'This is a static reminder for you',
            },
            trigger
            // trigger: {
            //     seconds: 1,
            //     repeats: false
            // }
        });

        //console.log(notificationId);
    }

    return (
        <View style={globalStyles.container}>
            
                <TextInput 
                    style={styles.textArea} 
                    placeholder="Reminder me..."
                    placeholderTextColor="#ccc"
                    multiline
                />
                <TextInput 
                    style={styles.whenTextInput} 
                    placeholder="When?" 
                    placeholderTextColor="#ccc"
                />
              
            <View style={{marginTop: 10, width:'100%'}}>         
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => {
                        fireNotification();
                    }}
                >
                    <Text style={styles.buttonText}>Notify</Text>
                </TouchableOpacity>

                <View style={{ marginTop: 10 }}>
                    <TouchableOpacity
                        style={styles.buttons}
                        onPress={() => navigation.navigate('Details')}
                    >
                        <Text style={styles.buttonText}>Details</Text>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', color: '#fff'}}>{new Date().toString()}</Text>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    textArea: { 
        minHeight: 100, 
        borderColor: 'gray', 
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        width: '90%', 
        padding: 10,
        fontSize: 20,
        margin: 10,
        color: '#fff' 
    },
    whenTextInput: {
        height: 50,
        borderColor: 'gray', 
        width: '90%', 
        padding: 10,
        fontSize: 20,
        margin: 10,
        color: '#fff',
        borderBottomColor: '#fff',
        borderBottomWidth: 1  
    },
    buttons: {
        backgroundColor: '#02BC80',
        padding: 20,
        textAlign: 'center',
        margin: 10
    },
    buttonText: {
        fontSize: 20,
        color:'#fff'
    }
});