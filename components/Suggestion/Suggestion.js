import React, { useEffect, useState, useMemo } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from './Suggestion.style';
import { storeReminderSuggestion, getAllReminderSuggestions } from '$lib/suggestion-objects.js';



export default function Suggestion({ show, compareText, suggestionType, onClose, onSelect }) {
    
    const storedSuggestionsMemo = useMemo(async () => {
        if (suggestionType === 'reminders') {
            return await getAllReminderSuggestions();
        }
    }, [suggestionType]);
    const [suggestionArray, setSuggestionArray] = useState([]);
    useEffect(() => {
        if (suggestionType === 'reminders') {
            setSuggestionArray(storedSuggestionsMemo);
        }
        else {
            setSuggestionArray([
                '1 hour',
                '5 min'
            ]);
        }
    }, [suggestionArray]);
    if (!show) { return null; }
    if (!suggestionArray.length) { return null; }
    const pattern = new RegExp(`^${compareText}`, 'ig');
    let match = null;
    let usedRate = 0;
    if (compareText.trim() === '') { 
        return null;
    }

    suggestionArray.forEach((s) => { 
        if (typeof s === 'string') {
            if (pattern.test(s)) { match = s; }
        }
        else {
            if (s.use > 1) {
                if (s.use > usedRate) {
                    if (pattern.test(s)) { 
                        if (s.use > usedRate) {
                            usedRate = s.use;
                            match = s; 
                        }                         
                    }
                }
            }
        }           
    });
   
    if (match === null) { return null; }

    function onSuggetionSelected() {
        onSelect(match);
        storeReminderSuggestion(match);
        onClose();
    }
    return (
        <View >
            <View style={styles.suggestionBox}>
                <TouchableOpacity onPress={onClose} style={styles.suggestionBoxCloseButton}><Text>×</Text></TouchableOpacity>
                
                <TouchableOpacity style={styles.textTouchable} onPress={onSuggetionSelected}>
                    <Text style={styles.suggestionBoxText}>{match}</Text>
                </TouchableOpacity>    
            </View>
        </View>
    );
}