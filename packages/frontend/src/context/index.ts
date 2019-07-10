import { ICourier } from "services/api";
import React from "react";

export interface IAppContext {
    courier: ICourier;
}

export const AppContext = React.createContext(({} as unknown) as IAppContext);
