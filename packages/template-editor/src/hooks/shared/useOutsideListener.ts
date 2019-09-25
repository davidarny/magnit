import { RefObject, useCallback, useEffect } from "react";

export function useOutsideListener(ref: RefObject<HTMLElement>, listener: () => void) {
    const onClickOutside = useCallback(
        (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
                listener();
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
