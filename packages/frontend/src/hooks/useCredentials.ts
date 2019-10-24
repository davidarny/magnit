import { navigate } from "@reach/router";
import { AppContext } from "context";
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { IAuthObserver, ICourier, login } from "services/api";

export function useCredentials(
    courier: ICourier,
    token: string,
    setToken: Dispatch<SetStateAction<string>>,
): [string, (username: string, password: string) => void, (observer: IAuthObserver) => void] {
    const namespace = "auth::token";

    const context = useContext(AppContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const local = localStorage.getItem(namespace);
        if (local) {
            setToken(local);
            navigate("tasks").catch(console.error);
        }
    }, [setToken]);

    const handleLogin = useCallback(
        (username: string, password: string) => {
            setUsername(username);
            setPassword(password);
            login(courier, username, password)
                .then(response => {
                    setToken(response.token);
                    localStorage.setItem(namespace, response.token);
                })
                .then(() => navigate("tasks"))
                .catch(() => {
                    context.setSnackbarState({ open: true, message: "Не удалось авторизоваться" });
                    context.setSnackbarError(true);
                });
        },
        [context, courier, setToken],
    );

    const handleTokenExpiration = useCallback(
        (observer: IAuthObserver) => {
            login(courier, username, password)
                .then(response => {
                    observer.setToken(response.token);
                    localStorage.setItem(namespace, response.token);
                })
                .catch(console.error);
        },
        [courier, password, username],
    );

    return [username, handleLogin, handleTokenExpiration];
}
