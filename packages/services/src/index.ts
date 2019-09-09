export * from "./editor";
export * from "./date";

type ExcludeMethod<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type NarrowCallside<T> = {
    [P in keyof T]: T[P] extends (...args: any) => T
        ? ReturnType<T[P]> extends T
            ? (...args: Parameters<T[P]>) => NarrowCallside<ExcludeMethod<T, P>>
            : T[P]
        : T[P];
};
