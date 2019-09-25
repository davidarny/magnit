import { RefObject, useCallback, useEffect } from "react";

export function useOutsideListener(
    ref: RefObject<HTMLElement>,
    listener: (event: MouseEvent) => void,
) {
    const onClickOutside = useCallback(
        (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
                listener(event);
            }
        },
        [listener, ref],
    );

    useEffect(() => {
        document.addEventListener("mousedown", onClickOutside);
        return () => {
            document.removeEventListener("mousedown", onClickOutside);
        };
    });
}
