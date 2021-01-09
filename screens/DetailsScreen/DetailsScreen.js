import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import globalStyles from '$styles/Global.styles.js'

export default function DetailsScreen({ navigation }) {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.defaultTextColor}>Details Screen</Text>
            <Button
                title="Go to Home"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    );
}