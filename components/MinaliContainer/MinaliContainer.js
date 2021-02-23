import React, {useEffect, useRef} from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from 'react-native';
import globalStyles from '$styles/Global.styles.js'; 
import LottieView from 'lottie-react-native';

function LoadingHeader() {
    const animRef = useRef(null);
    useEffect(() => {
        if (animRef.current) {
            animRef.current.play();
        }
    });
    return (
        <View style={loadingStyles.container}>
            <LottieView
                ref={animation => { animRef.current = animation; }}
                style={{
                    backgroundColor: '#3C3F43'
                }}
                // See: https://stackoverflow.com/questions/50593025/react-native-how-to-add-full-screen-lottie-animation
                resizeMode="cover" 
                source={require('./progressbar.json')}
            />
        </View>
    );
}



const loadingStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 30,
        backgroundColor: '#54FFC3',
        width: '100%',
        padding: 5,
        //elevation: 8
    },
    text: {
        color: '#3C3F43',
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: 10
    }
});

export default function MinaliContainer({ children, isLoading }) {
    // See: https://stackoverflow.com/questions/36822391/react-native-touchableopacity-onpress-problems-inside-a-scrollview
    // See: https://medium.com/@peterpme/taming-react-natives-scrollview-with-flex-144e6ff76c08
    return (
        <SafeAreaView style={[globalStyles.container, { paddingTop: 60 }]}>
            {isLoading && <LoadingHeader />}
            <ScrollView contentContainerStyle={{ width: '100%', flexGrow: 1 }} keyboardShouldPersistTaps="always">
                {children}
            </ScrollView>
        </SafeAreaView>
    );
}