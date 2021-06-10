// See: https://blog.jscrambler.com/how-to-use-react-native-asyncstorage/
// See: https://reactnative.dev/docs/asyncstorage
import AsyncStorage from '@react-native-community/async-storage';
import { removeNotification, schedNotif } from '$lib/notif.js';

const REMINDER_LIST_KEY = 'MinaliReminders@list';
const now = new Date();

(async () => {
    if (!(await AsyncStorage.getItem(REMINDER_LIST_KEY))) {
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

export async function clearAllReminders() {
    let storedReminders = await getAllReminders();
    if (!storedReminders.length) { return; }
    storedReminders.forEach(async (r) => {
        await removeNotification(r.notificationId);
    });
    await AsyncStorage.setItem(REMINDER_LIST_KEY, JSON.stringify([]));
}

export async function importReminders(jsonRemindersString) {
    try {
        const importedReminders = JSON.parse(jsonRemindersString);
        if (!(importedReminders instanceof Array)) { 
            console.log('Error: Reminders string not an Array!');
            return false; 
        }
        await clearAllReminders();
        let newReminders = [];
        importedReminders.forEach(async (r) => {
            const date = new Date(r.dateTime);
            const trigger = (() => {
                if (!r.recurring) {
                    return date;
                }
                // For recurring reminders below. Currently I only support daily or weekly
                let tObj = {
                    repeats: true,
                    hour: date.getHours(),
                    minute: date.getMinutes()
                };
                if (r.recurring === 'weekly') {
                    tObj.weekday = date.getDay() + 1
                }
                return tObj;
            })();
            // Schedule the notification
            let notificationId = await schedNotif({
                content: {
                    title: "🔔 Reminder",
                    body: r.reminder.trim(),
                },
                trigger
            });
            r.notificationId = notificationId;
            newReminders.push(r);
            await AsyncStorage.setItem(REMINDER_LIST_KEY, JSON.stringify(newReminders)); 
        });
        return true;
    }
    catch (e) {
        console.log(e.message); 
        return false;
    }
}