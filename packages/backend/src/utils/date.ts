export function getFriendlyDate(date: Date, full: boolean = false): string {
    const day = normalizeDateNumber(date.getDate());
    const month = normalizeDateNumber(date.getMonth() + 1);
    const year = date.getFullYear();
    const horus = normalizeDateNumber(date.getHours());
    const minutes = normalizeDateNumber(date.getMinutes());
    if (full) {
        return `${day}.${month}.${year} ${horus}:${minutes}`;
    }
    return `${day}.${month}.${year}`;
}

function normalizeDateNumber(number: number): string {
    if (number.toString().length === 1) {
        return `0${number}`;
    }
    return number.toString();
}
