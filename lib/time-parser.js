import Sherlock from 'sherlockjs'; // See: https://github.com/neilgupta/Sherlock


function getDigit(text) {
    let digit = text.trim().replace(/\D/ig, '');
    let num = parseInt(digit, 10);
    if (isNaN(num)) { return 0; }
    return num;
}

function getTimeInSeconds(text) {
    const minRegExp = /(.*\s+min[s]?\s*)|(.*\s+minute[s]?\s*)/ig
    const hrRegExp = /(.*\s+hr[s]?\s*)|(.*\s+hours[s]?\s*)/ig
    text = text.trim();
    let digit = getDigit(text);
    if (digit < 1) {
        return null;
    }
    if (minRegExp.test(text)) {
        return 60 * digit;
    }
    else if (hrRegExp.test(text)) {
        return (60 * 60) * digit;
    }
    return null;
}

export default function timeParser(text) {
    const andRegExp = /.+\s+and\s+.+/ig
    if (andRegExp.test(text)) {
        const p = text.split(/\s+and\s+/ig);
        if (p.length > 1) {
            let p1 = Sherlock.parse(p[0]);
            let p2 = Sherlock.parse(p[1]);
            if (p1.startDate && p2.startDate) {
                let seconds = getTimeInSeconds(p[1]);
                let newStartDate = p1.startDate;
                newStartDate.setSeconds(newStartDate.getSeconds() + seconds);
                p1.startDate = newStartDate;
                return p1;
            }
        }
    }
    return Sherlock.parse(text);
}