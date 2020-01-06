import { navigate } from "@reach/router";
import { AppContext } from "context";
import _ from "lodash";
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { IAuthObserver, ICourier, login } from "services/api";

export function useCredentials(
    courier: ICourier,
    token: string,
    setToken: Dispatch<SetStateAction<string>>,
): [
    string,
    (username: string, password: string) => void,
    () => void,
    (observer: IAuthObserver) => Promise<void>,
] {
    const namespace = "auth::";
    const keys = {
        token: `${namespace}token`,
        username: `${namespace}username`,
        password: `${namespace}password`,
    };

    const context = useContext(AppContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const local = {
            token: localStorage.getItem(keys.token),
            username: localStorage.getItem(keys.username),
            password: localStorage.getItem(keys.password),
        };
        if (local.username) {
            setUsername(local.username);
        }
        if (local.password) {
            setPassword(local.password);
        }
        if (local.token) {
            setToken(local.token);
            navigate("tasks").catch(console.error);
        }
    }, [keys.password, keys.token, keys.username, setToken]);

    const handleLogin = useCallback(
        (username: string, password: string) => {
            setUsername(username);
            setPassword(password);
            localStorage.setItem(keys.username, username);
            localStorage.setItem(keys.password, password);
            login(courier, username, password)
                .then(response => {
                    setToken(response.token);
                    localStorage.setItem(keys.token, response.token);
                })
                .then(() => navigate("tasks"))
                .catch(() => {
                    context.setSnackbarState({ open: true, message: "Не удалось авторизоваться" });
                    context.setSnackbarError(true);
                });
        },
        [context, courier, keys.password, keys.token, keys.username, setToken],
    );

    const handleLogout = useCallback(() => {
        setUsername("");
        setPassword("");
        setToken("");
        for (const entry of Object.entries(keys)) {
            localStorage.removeItem(_.last(entry)!);
        }
    }, [keys, setToken]);

    const handleTokenExpiration = useCallback(
        async (observer: IAuthObserver) => {
            try {
                const response = await login(courier, username, password);
                observer.setToken(response.token);
                localStorage.setItem(namespace, response.token);
            } catch (error) {
                console.error(error);
            }
        },
        [courier, password, username],
    );

    return [username, handleLogin, handleLogout, handleTokenExpiration];
}
