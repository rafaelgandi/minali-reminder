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
                        textAlign: 'center',
                        fontSize: 15
                    }]}
                >
                    A super minimal reminder app built for you. 😁
            </Text>
            <Text style={{marginTop: -40, color: '#556064', fontSize: 12, textAlign: 'center'}}>www.rafaelgandi.com</Text>
            </View> 
        </MinaliContainer> 
    );
}