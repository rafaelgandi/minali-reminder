
export function pint(_str) {
    let num = parseInt(_str, 10);
    if (isNaN(num)) { return 0; }
    return num;
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