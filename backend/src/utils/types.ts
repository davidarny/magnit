type Writeable<T> = { -readonly [P in keyof T]: T[P] };

type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
