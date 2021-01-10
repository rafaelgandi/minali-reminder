import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import globalStyles from '$styles/Global.styles.js'

export default function AboutScreen({ navigation }) {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.defaultTextColor}>About content should go here</Text>
        </View>
    );
}