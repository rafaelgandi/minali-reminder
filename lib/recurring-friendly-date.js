

function _getTwelveHrFormatTime(date) {
    let suffix = (date.getHours() > 11) ? 'pm' : 'am';
    let hr = date.getHours();
    if (hr > 12) { hr = hr - 12; }
    if (hr === 0) { hr = 12; }
    let m = date.getMinutes();
    if (m < 10 || m === 0) { m = '0' + m; }
    return `${hr}:${m} ${suffix}`; 
}

export function recurringDate(reminderObj) {
    const date = new Date(reminderObj.dateTime);
    
    if (reminderObj.recurring === 'daily') {
        return `Everyday at ${_getTwelveHrFormatTime(date)}`; 
    }
    else {
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        return `Every ${weekdays[date.getDay()]} at ${_getTwelveHrFormatTime(date)}`; 
    }
}