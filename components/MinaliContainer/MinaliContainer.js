import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from 'react-native';
import globalStyles from '$styles/Global.styles.js';

function LoadingHeader() {
    return (
        <View style={loadingStyles.container}>
            <Text style={loadingStyles.text}>Refreshing data...</Text>
        </View>
    );
}

const loadingStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: '#54FFC3',
        width: '100%',
        padding: 5,
        elevation: 8,
        opacity: 0.5
    },
    text: {
        color: '#fff', 
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
            <ScrollView contentContainerStyle={{ width: '100%', flexGrow: 1 }} keyboardShouldPersistTaps="always">
                {isLoading && <LoadingHeader />}             
                {children}
            </ScrollView>
        </SafeAreaView>
    );
}