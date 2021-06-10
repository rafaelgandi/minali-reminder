import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    textArea: {
        minHeight: 50,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        width: '90%',
        padding: 10,
        fontSize: 20,
        margin: 10,
        color: '#fff'
    },
    whenTextInput: {
        height: 50,
        width: '90%',
        padding: 10,
        fontSize: 20,
        margin: 10,
        color: '#fff',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1   
    },
    buttons: {
        backgroundColor: '#ccc',
        padding: 15,
        margin: 10,
        borderRadius: 3,
        width: '80%'
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold'
    },
    dateConfirmerCon: {
        padding: 3,
        marginLeft: 10,
        marginRight: 10,
        position: 'absolute',
        top: -8
    },
    dateConfirmerText: {
        textAlign: 'center',
        color: '#fff',
        padding: 3,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 2,

        fontSize: 10
    },
    recurringPickerCon: {
        marginTop: 10,
        padding: 3,
        paddingLeft: 10
    },
    recurrPicker: {
        height: 30,
        width: 300,
        color: '#ccc',
        backgroundColor: '#3C3F43'
    },
    labelGood: {
        backgroundColor: '#F9D943',
        color: '#C48540'
    },
    labelBad: {
        backgroundColor: '#E2817A',
        color: '#880E15'
    },
    labelNormal: {
        backgroundColor: '#B1ECA4',
        color: '#33931E'
    }
});


export default styles;