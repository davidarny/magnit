import React from "react";
import { ICourier } from "services/api";

export interface IAppContext {
    snackbar: { open: boolean; message: string };
    courier: ICourier;

    setSnackbarState(options: { message: string; open: boolean }): void;

    setSnackbarError(error: boolean): void;
}

export const AppContext = React.createContext(({} as unknown) as IAppContext);
