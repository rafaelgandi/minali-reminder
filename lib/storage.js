// See: https://blog.jscrambler.com/how-to-use-react-native-asyncstorage/
// See: https://reactnative.dev/docs/asyncstorage
import AsyncStorage from '@react-native-community/async-storage';

const REMINDER_LIST_KEY = 'MinaliReminders@list';
const now = new Date();

(async () => {
    if (!await AsyncStorage.getItem(REMINDER_LIST_KEY)) {
        await AsyncStorage.setItem(REMINDER_LIST_KEY, JSON.stringify([]));
    }
})();

export async function getAllReminders() {
    const storedReminders = await AsyncStorage.getItem(REMINDER_LIST_KEY);
    if (storedReminders) {
        const arrReminders = JSON.parse(storedReminders);
        if (arrReminders.length) {
            arrReminders.sort((a, b) => {
                if (a.dateTime < b.dateTime) {
                    return -1;
                }
                if (a.dateTime > b.dateTime) {
                    return 1;
                }              
                return 0;
            });
            return arrReminders;
        }
    }
    return [];
}

export async function storeNewReminder(reminder) {
    const storedReminders = await getAllReminders();
    storedReminders.push(reminder);
    await AsyncStorage.setItem(REMINDER_LIST_KEY, JSON.stringify(storedReminders));
    return reminder;
}

export async function removeReminderViaNotifId(notificationId) {
    let storedReminders = await getAllReminders();
    if (!storedReminders.length) { return; }
    storedReminders = storedReminders.filter((r) => r.notificationId !== notificationId);
    await AsyncStorage.setItem(REMINDER_LIST_KEY, JSON.stringify(storedReminders));
    return notificationId;
}

export async function updateReminderByNotifId(notificationId, newData) {
    let storedReminders = await getAllReminders();
    if (!storedReminders.length) { return; }
    let notif = null;
    storedReminders = storedReminders.map((r) => {
        if (r.notificationId === notificationId) {
            return newData;
        }
        else {
            return r;
        }
    });
    await AsyncStorage.setItem(REMINDER_LIST_KEY, JSON.stringify(storedReminders));
    return storedReminders;
}

export async function getReminderByNotifId(notificationId) {
    let storedReminders = await getAllReminders();
    if (!storedReminders.length) { return; }
    let notif = null;
    storedReminders.forEach((r) => {
        if (r.notificationId === notificationId) {
            notif = r;
        }
    });
    return notif;
}