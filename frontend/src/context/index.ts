import React from "react";
import { ICourier } from "services/api";
import { ISnackbarState } from "hooks";

export interface IAppContext {
    snackbar: { open: boolean; message: string };
    courier: ICourier;

    setSnackbarState(options: ISnackbarState): void;

    setSnackbarError(error: boolean): void;
}

export const AppContext = React.createContext(({} as unknown) as IAppContext);
