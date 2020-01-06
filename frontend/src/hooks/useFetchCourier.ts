import { useMemo } from "react";
import {
    CamelCaseMiddleware,
    FetchCourier,
    JsonParseMiddleware,
    LoggerMiddleware,
} from "services/api";

export function useFetchCourier(token: string): FetchCourier {
    return useMemo(
        () =>
            new FetchCourier(process.env.REACT_APP_BACKEND_URL, "v1", token, [
                new JsonParseMiddleware(),
                new CamelCaseMiddleware(),
                new LoggerMiddleware(),
            ]),
        [token],
    );
}
