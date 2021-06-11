// LM: 2021-03-04 12:17:20 BIG PROPS TO COL REMINDER!
import React from 'react';
import { TouchableWithoutFeedback, Text, View, Linking } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js'
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';
import routes from '$lib/routes.js';
import useNotificationRecievedListener from '$lib/useNotificationRecievedListener.js';

async function openMyWebsite() {
    const url = 'https://rafaelgandi.com';
    const supported = await Linking.canOpenURL(url);     
    if (supported) {
        await Linking.openURL(url);
    }
}


export default function AboutScreen({ navigation }) {
    const isFocused = useIsFocused();
    useNotificationRecievedListener((notificationId) => {
        navigation.navigate(routes.reminderDetail, { id: notificationId, fromNotificationTap: true });
    }, isFocused);

    return (
        <MinaliContainer>
            <View style={[globalStyles.container, { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }]}>
                <Text style={{color: '#fff'}}>🤖</Text>
                <Text style={{textAlign:'center', fontSize: 8, color: '#BFBEB7'}}>Build 20210611A</Text>               
                <TouchableWithoutFeedback onPress={openMyWebsite}>
                    <Text style={{ color: '#54FFC3', fontSize: 12, textAlign: 'center', marginBottom:10 }}>www.rafaelgandi.com</Text>
                </TouchableWithoutFeedback>              
                <Text
                    style={[globalStyles.defaultTextColor, {
                        textAlign: 'center',
                        fontSize: 15,
                        color: '#BFBEB7'
                    }]}
                >
                    A super minimal reminder app built with simplicity in mind.
                </Text>
            </View>
        </MinaliContainer>
    );
}