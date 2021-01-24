import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import globalStyles from '$styles/Global.styles.js'
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';
import useNotificationRecieved from '$lib/useNotificationRecieved.js';
import routes from '$lib/routes.js';

export default function AboutScreen({ navigation }) {
    useNotificationRecieved((notificationId) => {
        navigation.navigate(routes.reminderDetail, {id: notificationId});
    });
    return (
        <MinaliContainer>
            <View style={[globalStyles.container, {flex:1, alignItems:'center', justifyContent:'center', height: '100%' }]}>
                <Text
                    style={[globalStyles.defaultTextColor, {
                        padding: 50,
                        textAlign: 'center',
                        fontSize: 15
                    }]}
                >
                    A super minimal reminder app built for you. 😁
            </Text>
            </View> 
        </MinaliContainer> 
    );
}