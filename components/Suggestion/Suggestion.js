import React, { useEffect, useState, useMemo } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from './Suggestion.style';
import { storeReminderSuggestion, getAllReminderSuggestions, whenSuggestions } from '$lib/suggestion-objects.js';

const REMINDERS_SUGGESTION_TYPE = 'reminders';

export default function Suggestion({ show, compareText, suggestionType, onClose, onSelect }) {

    const [suggestionArray, setSuggestionArray] = useState(whenSuggestions);
    useEffect(() => {
        if (suggestionType === REMINDERS_SUGGESTION_TYPE) {
            (async () => {
                setSuggestionArray([]);
                const storedSuggestions = await getAllReminderSuggestions();
                //console.log(storedSuggestions);
                setSuggestionArray(storedSuggestions);
            })();           
        }
        else {
            setSuggestionArray(whenSuggestions);
        }
    }, [suggestionType]); 

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
                if (pattern.test(s.text)) {
                    if (s.use > usedRate) {
                        usedRate = s.use;
                        match = s.text;
                    }
                }
            }
        }
    });

    if (match === null) { return null; }

    function onSuggetionSelected() {
        onSelect(match);
        if (suggestionType === REMINDERS_SUGGESTION_TYPE) {
            storeReminderSuggestion(match);
        }       
        onClose();
    }

    return (
        <View>
            <View style={styles.suggestionBox}>
                <View style={{flex: 1}}>
                    <TouchableOpacity onPress={onClose} style={styles.suggestionBoxCloseButton}>
                        <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 7}}> 
                    <TouchableOpacity onPress={onSuggetionSelected} style={styles.textTouchable}>
                        <Text style={styles.suggestionBoxText}>{match}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}