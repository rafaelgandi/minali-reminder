import React, { useEffect, useRef } from 'react';
import { TouchableWithoutFeedback, Text, View, Linking } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import globalStyles from '$styles/Global.styles.js'
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';
import routes from '$lib/routes.js';
import useNotificationRecievedListener from '$lib/useNotificationRecievedListener.js';
import LottieView from 'lottie-react-native';

async function openMyWebsite() {
    const url = 'https://rafaelgandi.com';
    const supported = await Linking.canOpenURL(url);    
    if (supported) {
        await Linking.openURL(url);
    }
}


export default function AboutScreen({ navigation }) {
    const isFocused = useIsFocused();
    const animRef = useRef(null);
    useNotificationRecievedListener((notificationId) => {
        navigation.navigate(routes.reminderDetail, { id: notificationId, fromNotificationTap: true });
    }, isFocused);

    useEffect(() => {
        if (isFocused && animRef.current) {
            animRef.current.play();
        }
    });

    return (
        <MinaliContainer>
            <View style={[globalStyles.container, { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }]}>
                <LottieView
                    ref={animation => {
                        animRef.current = animation;
                    }}
                    style={{
                        width: 50,
                        height: 50,
                        backgroundColor: '#3C3F43',
                    }}
                    // See: https://stackoverflow.com/questions/50593025/react-native-how-to-add-full-screen-lottie-animation
                    resizeMode="cover" 
                    source={require('./bell.json')}
                    // OR find more Lottie files @ https://lottiefiles.com/featured
                    // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
                />
                <TouchableWithoutFeedback onPress={openMyWebsite}>
                    <Text style={{ color: '#54FFC3', fontSize: 12, textAlign: 'center', marginBottom:20 }}>www.rafaelgandi.com</Text>
                </TouchableWithoutFeedback>              
                <Text
                    style={[globalStyles.defaultTextColor, {
                        textAlign: 'center',
                        fontSize: 15
                    }]}
                >
                    A super minimal reminder app built for you.
                </Text>
            </View>
        </MinaliContainer>
    );
}