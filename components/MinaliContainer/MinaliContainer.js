import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import globalStyles from '$styles/Global.styles.js';

export default function MinaliContainer({ children }) {
    // See: https://stackoverflow.com/questions/36822391/react-native-touchableopacity-onpress-problems-inside-a-scrollview
    return (
        <SafeAreaView style={[globalStyles.container, { paddingTop: 60, flex: 1 }]}> 
            <ScrollView style={{ width: '100%' }} keyboardShouldPersistTaps="always">
                {children}
            </ScrollView>
        </SafeAreaView>
    );
}