export function createMockFrom<T>(value: T): T {
    const initialValue = value;
    const excludedProps = Object.getOwnPropertyNames(Object.prototype);

    const props = [];
    do {
        props.push(...Object.getOwnPropertyNames(value));
    } while ((value = Object.getPrototypeOf(value)));

    const filteredProps = props
        .sort()
        .filter(prop => prop !== "constructor" && !excludedProps.includes(prop))
        .filter(prop => typeof initialValue[prop] === "function");

    const result = {};

    for (const prop of filteredProps) {
        result[prop] = new Function();
    }

    return result as T;
}
