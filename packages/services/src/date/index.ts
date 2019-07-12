export function getFriendlyDate(date: Date): string {
    const day = normalizeDateNumber(date.getDate());
    const month = normalizeDateNumber(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function normalizeDateNumber(number: number): string {
    if (number.toString().length === 1) {
        return `0${number}`;
    }
    return number.toString();
}
