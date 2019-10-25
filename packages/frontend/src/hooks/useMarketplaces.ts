import { IMarketplace } from "@magnit/entities";
import { useEffect, useState } from "react";
import { getAllMarketplaces, ICourier } from "services/api";

export function useMarketplaces(courier: ICourier) {
    const [marketplaces, setMarketplaces] = useState<IMarketplace[]>([]);

    useEffect(() => {
        getAllMarketplaces(courier)
            .then(response => setMarketplaces(response.marketplaces))
            .catch(console.error);
    }, [courier]);

    return marketplaces;
}
