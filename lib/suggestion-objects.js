import AsyncStorage from '@react-native-async-storage/async-storage';

const REMINDER_SUGGESTIONS_KEY = 'MinaliReminders@reminderSuggestions';
const now = new Date();


/*
    [
        {
            key,
            use,
            usedAt,
            text
        },
    ]   ...
*/
function normalize(text = '') {
    let t = text.trim().toLowerCase();
    t = t.replace(/\s/g, '');
    return t.trim();
}

export async function getAllReminderSuggestions() {
    const storedSuggestions = await AsyncStorage.getItem(REMINDER_SUGGESTIONS_KEY);
    if (storedSuggestions) {
        const suggestions = JSON.parse(storedSuggestions);
        if (suggestions.length) {
            suggestions.sort((a, b) => {
                if (a.use < b.use) {
                    return -1;
                }
                if (a.use > b.use) {
                    return 1;
                }
                return 0;
            });
            return suggestions;
        }
    }
    return [];
}

async function exists(text, suggestionsArr = null) {
    const storedSuggestions = (!suggestionsArr) ? await getAllReminderSuggestions() : suggestionsArr;
    const key = normalize(text);
    let existing = false;
    storedSuggestions.forEach((s) => {
        if (s.key === key) {
            existing = true;
        }
    });
    return existing;
}

export async function storeReminderSuggestion(reminder) {
    const storedSuggestions = await getAllReminderSuggestions();
    const key = normalize(reminder);
    if (! await exists(reminder, storedSuggestions)) {
        storedSuggestions.push({
            key: key,
            use: 1,
            usedAt: now.getTime(),
            text: reminder
        });
    }
    else {
        storedSuggestions.forEach((s, k) => {
            if (s.key === key) {
                storedSuggestions[k].use += 1;
                storedSuggestions[k].usedAt = now.getTime();
            }
        });
    }
    await AsyncStorage.setItem(REMINDER_SUGGESTIONS_KEY, JSON.stringify(storedSuggestions));

    //console.log(storedSuggestions);
    return reminder;
}

export async function cleanOldSuggestions() {
    const storedSuggestions = await getAllReminderSuggestions();
    if (!storedSuggestions.length) { return; }
    let keepsArr = [];
    // See: https://stackoverflow.com/questions/1663999/javascript-test-if-date-in-string-format-is-more-than-30-days-ago/1664053
    const thirtyDaysInMilliseconds = 2592000000;
    const sevenDaysInMilliseconds = 604800000; 
    storedSuggestions.forEach((s, k) => {
        // Check for suggestions that have been used less than 3 times
        if (s.used < 3) {
            // Keep suggestions that have been used less than 3 times but is not yet 1 week old.
            if ((now - s.usedAt) < sevenDaysInMilliseconds) {
                keepsArr.push(s);
            }
            return; 
        }
        //console.log((now - s.usedAt), thirtyDaysInMilliseconds);
        // Check if suggestion is more than 30 days old. If not then keep it.
        if (!((now - s.usedAt) > thirtyDaysInMilliseconds)) {
            // Keep suggestions that are used more than 2 times and are not more than 30 days old.
            keepsArr.push(s);        
        }
    });

    console.log(keepsArr); 

    await AsyncStorage.setItem(REMINDER_SUGGESTIONS_KEY, JSON.stringify(keepsArr));   
}

export const whenSuggestions = [
    '1 hour',
    '5 min',
    'Tomorrow',
    '50 mins',
    'One hr and 30 mins',
    '45 mins',
    '30 mins',
    '15 mins',
    '10 mins',
    '2 hours from now',
    '3 hours from now'
];

