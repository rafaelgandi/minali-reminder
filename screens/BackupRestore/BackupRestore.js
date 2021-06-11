import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, Text, View, Alert, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js'
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';
import { getAllReminders, importReminders } from '$lib/storage';
import { isJson } from '$lib/helpers.js';
import routes from '$lib/routes.js';
import useNotificationRecievedListener from '$lib/useNotificationRecievedListener.js';
import { getAllReminderSuggestions } from '$lib/suggestion-objects.js';



export default function BackupRestore({ navigation }) {
    const isFocused = useIsFocused();
    const [textValue, setTextValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [suggetionsSavedCount, setSuggestionsSavedCount] = useState(0);
    useNotificationRecievedListener((notificationId) => {
        navigation.navigate(routes.reminderDetail, {id: notificationId, fromNotificationTap: true});
    }, isFocused);
    
    useEffect(() => {
        if (isFocused) {
            setIsLoading(true);
            setTimeout(() => {
                (async () => {
                    const remindersArr = await getAllReminders(); 
                    const remindersJson = JSON.stringify(remindersArr);
                    const storedSuggestions = await getAllReminderSuggestions();
                    setTextValue(remindersJson);
                    setSuggestionsSavedCount(storedSuggestions.length);
                    setIsLoading(false);
                })();
            }, 300);          
        }
    }, [isFocused]);

    return (
        <MinaliContainer isLoading={isLoading}>
            <Text style={[globalStyles.headerText, { padding: 10, paddingBottom: 0, width: '70%' }]}>Backup &amp; Import</Text>
            <View style={[globalStyles.container, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>            
                <TextInput
                    style={styles.textArea}
                    multiline
                    value={textValue}
                    onChangeText={(text) => {
                        setTextValue(text);
                    }}
                />
                <View style={{paddingTop: 2}}>
                    <Text style={{fontSize: 10, color: '#ccc'}}>There are {suggetionsSavedCount} saved suggestions.</Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        if (!isJson(textValue)) {
                            Alert.alert("Invalid", "Invalid import format.", [
                                {
                                    text: 'Okay',
                                    onPress: () => { 
                                        setTextValue('');
                                    }
                                }
                            ], { cancelable: false });
                            return;
                        }
                        Alert.alert("Import Reminders", "Are you sure you want to import these reminders? This will override all currently saved reminders", [
                            {
                                text: 'Cancel',
                                onPress: () => { }
                            },
                            {
                                text: 'Import',
                                onPress: async () => {
                                    if (await importReminders(textValue)) {
                                        navigation.navigate(routes.reminderList);
                                    }
                                    else {
                                        Alert.alert("Invalid", "Unable to import. Please check your import string.", [
                                            { text: 'Okay', onPress: () => { setTextValue(''); } }
                                        ], { cancelable: false });
                                    }                                    
                                }
                            }
                        ], { cancelable: false }); 
                    }}
                >
                    <Text style={styles.buttonText}>Import</Text>
                </TouchableOpacity>
            </View>
        </MinaliContainer>
    );
}

const styles = StyleSheet.create({
    textArea: {
        backgroundColor: '#000',
        color: '#fff',
        fontSize: 12,
        width: '90%',
        height: 300,
        padding: 10,
    },
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
        elevation: 8
    }
});