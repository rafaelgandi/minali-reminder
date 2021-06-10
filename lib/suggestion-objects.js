import AsyncStorage from '@react-native-community/async-storage';

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
    if (! exists(reminder, storedSuggestions)) {
        storedSuggestions.push({
            key: normalize(reminder),
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

    console.log(storedSuggestions);
    return reminder;
}

