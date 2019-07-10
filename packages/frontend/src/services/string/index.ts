export function toSnakeCase(string: string): string {
    const upperChars = string.match(/([A-Z])/g);
    if (!upperChars) {
        return string;
    }

    let str = string.toString();
    for (let i = 0, n = upperChars.length; i < n; i++) {
        str = str.replace(new RegExp(upperChars[i]), "_" + upperChars[i].toLowerCase());
    }

    if (str.slice(0, 1) === "_") {
        str = str.slice(1);
    }

    return str;
}

export function toCamelCase(string: string): string {
    return string
        .replace(/\s(.)/g, str => str.toUpperCase())
        .replace(/\s/g, "")
        .replace(/^(.)/, str => str.toLowerCase());
}
