type TCallback = (...args: any[]) => void | boolean;

export function traverse(object: any | any[], callback?: TCallback, parent?: any | any[]): void {
    if (isArray(object)) {
        const result = callback && callback(object, parent);
        if (result) {
            return;
        }
        object.forEach(prop => traverse(prop, callback, parent));
    } else if (isObject(object)) {
        const result = callback && callback(object, parent);
        if (result) {
            return;
        }
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                traverse(object[key], callback, object);
            }
        }
    } else {
        callback && callback(object, parent);
    }
}

function isArray(value: any): value is any[] {
    return Object.prototype.toString.call(value) === "[object Array]";
}

function isObject(value: any): value is any {
    return typeof value === "object" && value !== null;
}
