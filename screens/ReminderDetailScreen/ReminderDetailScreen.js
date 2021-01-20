import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js'
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';
import { getReminderByNotifId } from '$lib/storage';
import { snooze } from '$lib/helpers.js';

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

    async function onSnooze() {
        if (reminderDetails && !reminderDetails.recurring) {
            await snooze(reminderDetails);
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
                        onPress={onSnooze}
                    >
                        <Text style={styles.buttonText}>Notify in 10 min</Text>
                    </TouchableOpacity>}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('ReminderList')}
                    >
                        <Text style={styles.buttonText}>Okay</Text>
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