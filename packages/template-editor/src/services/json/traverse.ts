export function traverse(object: any | any[], callback?: (...args: any[]) => void): void {
    if (isArray(object)) {
        callback && callback(object);
        object.forEach(x => traverse(x, callback));
    } else if (isObject(object)) {
        callback && callback(object);
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                traverse(object[key], callback);
            }
        }
    } else {
        callback && callback(object);
    }
}

function isArray(value: any): value is any[] {
    return Object.prototype.toString.call(value) === "[object Array]";
}

function isObject(value: any): value is any {
    return typeof value === "object" && value !== null;
}
