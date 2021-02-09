import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import globalStyles from '$styles/Global.styles.js';

export default function MinaliContainer({ children }) {
    // See: https://stackoverflow.com/questions/36822391/react-native-touchableopacity-onpress-problems-inside-a-scrollview
    // See: https://medium.com/@peterpme/taming-react-natives-scrollview-with-flex-144e6ff76c08
    return (
        <SafeAreaView style={[globalStyles.container, { paddingTop: 60 }]}> 
            <ScrollView contentContainerStyle={{ width: '100%', flexGrow: 1 }} keyboardShouldPersistTaps="always">
                {children}
            </ScrollView>
        </SafeAreaView>
    );
}