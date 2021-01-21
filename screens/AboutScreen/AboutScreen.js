import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import globalStyles from '$styles/Global.styles.js'
import MinaliContainer from '$components/MinaliContainer/MinaliContainer';

export default function AboutScreen({ navigation }) {
    return (
        <MinaliContainer>
            <View style={[globalStyles.container, {flex:1, alignItems:'center', justifyContent:'center' }]}>
                <Text
                    style={[globalStyles.defaultTextColor, {
                        padding: 50,
                        textAlign: 'center'
                    }]}
                >
                    A super minimal reminder app built for you. 😁
            </Text>
            </View>
        </MinaliContainer>
    );
}