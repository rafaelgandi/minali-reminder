import { schedNotif } from '$lib/notif.js';
import { updateReminderByNotifId } from '$lib/storage';


export function pint(_str) {
    let num = parseInt(_str, 10);
    if (isNaN(num)) { return 0; }
    return num;
}

export function isJson(_str) {
    try {
        JSON.parse(_str);
        return true;
    }
    catch (e) {
        return false;
    }
}

export function myFormattedDate(date) {
    const monthShorMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthLongMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dd = date.getDate(),
        mm = (date.getMonth() + 1),
        yyyy = date.getFullYear();
    if (dd <= 9) { dd = '0' + dd; }
    if (mm <= 9) { mm = '0' + mm; }
}

export function isToday(date) {
    const now = new Date();
    return (
        date.getDate() === now.getDate() && 
        date.getMonth() === now.getMonth() && 
        date.getFullYear() === now.getFullYear() 
    );
}

export async function snooze(reminderDetails) {
    if (reminderDetails && !reminderDetails.recurring) {
        const oldNotificationId = reminderDetails.notificationId;
        const now = new Date();
        const TEN_MINUTES = 600; // seconds
        //const TEN_MINUTES = 3; // seconds
        now.setSeconds(now.getSeconds() + TEN_MINUTES);
        const notificationId = await schedNotif({
            content: {
                title: "🔔 Reminder",
                body: reminderDetails.reminder,
            },
            trigger: now
        });
        reminderDetails.notificationId = notificationId;
        reminderDetails.dateTime = now.getTime();
        await updateReminderByNotifId(oldNotificationId, reminderDetails);
    }
}