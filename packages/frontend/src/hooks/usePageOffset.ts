import _ from "lodash";
import { useEffect, useState } from "react";

export function usePageOffset(authorized: boolean): [number, number] {
    const [drawerWidth, setDrawerWidth] = useState(0);
    const [logoHeight, setLogoHeight] = useState(0);

    useEffect(() => {
        const drawer = document.getElementById("drawer");
        if (!drawer) {
            return;
        }

        const drawerFirstChild = _.head([...drawer.children]);
        if (!drawerFirstChild) {
            return;
        }
        setDrawerWidth(drawerFirstChild.clientWidth);

        const logo = document.getElementById("logo");
        if (!logo) {
            return;
        }
        setLogoHeight(logo.clientHeight);
    }, [authorized]);

    return [drawerWidth, logoHeight];
}
