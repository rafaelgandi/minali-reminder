import React from 'react';
import { StyleSheet } from 'react-native';

const s = (() => {
    let s = {};
    s.container = {
        backgroundColor: '#3C3F43',
        flex: 1,
        //alignItems: 'center',
        //justifyContent: 'top',
        paddingTop: 40
    };

    s.defaultTextColor = {
        color: '#fff'
    };

    s.primaryButtons = {
        padding: 5,
        textAlign: 'center'
    };
    //  🎯
    s.headerText = {
        padding: 20,
        fontWeight: 'bold',
        fontSize: 30,
        color: '#fff',
        
        textAlign: 'left'
    };

    s.defaultBoxShadow = {
        shadowColor: "#54FFC3",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5
    };

    return s;
})();

export const screenHeaderOptions = {
    headerStyle: {
        backgroundColor: '#3C3F43'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold',
    }
};

export const styleObject = s;

const styles = StyleSheet.create(styleObject);
export default styles;