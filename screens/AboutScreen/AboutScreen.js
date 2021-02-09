import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js'
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';
import routes from '$lib/routes.js';
import useNotificationRecievedListener from '$lib/useNotificationRecievedListener.js';


export default function AboutScreen({ navigation }) {
    const isFocused = useIsFocused();
    useNotificationRecievedListener((notificationId) => {
        navigation.navigate(routes.reminderDetail, {id: notificationId, fromNotificationTap: true});
    }, isFocused);

    return (
        <MinaliContainer>
            <View style={[globalStyles.container, { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }]}>
                <Text
                    style={[globalStyles.defaultTextColor, {                      
                        textAlign: 'center',
                        fontSize: 15
                    }]}
                >
                    A super minimal reminder app built for you. 😁
                </Text>
                <Text style={{color: '#556064', fontSize: 12, textAlign: 'center' }}>www.rafaelgandi.com</Text>
            </View>
        </MinaliContainer>
    );
}