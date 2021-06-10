import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    suggestionBox: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#36C4EF',
        position: 'absolute',
        top:5,
        left: 5,
        paddingLeft: 20,
        paddingRight: 20,
        //width: '100%',
        //height: 100,
        elevation: 6,
        borderRadius: 20,
        opacity: 1
    },
    suggestionBoxCloseButton: {
        padding: 5
    },
    suggestionBoxText: {
        color: '#0A6986',
        fontSize: 12
    },

    textTouchable: {
        padding: 10
    }
});


export default styles;