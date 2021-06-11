import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

    suggestionBox: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ECD5E6',
        position: 'absolute',
        top:5,
        left: 10,
        padding: 8,
        paddingLeft: 20,
        paddingRight: 20,
        maxWidth: '95%',
        //height: 100,
        elevation: 6,
        borderRadius: 20,
        opacity: 0.9,
        // See: https://stackoverflow.com/a/54414774
        zIndex: 5
    },
    suggestionBoxCloseButton: {
        marginRight: 2,
        //marginLeft: 20,
        backgroundColor: '#6B2263',
        width: 30,
        height: 30,
        borderRadius: 20
    },
    closeText: {
        color: '#ECD5E6',
        fontSize: 20,
        textAlign: 'center',
        position: 'relative',
        bottom: 2
    },
    suggestionBoxText: {
        color: '#6B2263',
        fontSize: 12
    },
    textTouchable: {
        padding: 10
    }
});


export default styles;