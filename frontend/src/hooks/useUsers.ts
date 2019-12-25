import { IUser } from "@magnit/entities";
import { useEffect, useState } from "react";
import { getAllUsers, ICourier } from "services/api";

export function useUsers(courier: ICourier, authorized: boolean = true): IUser[] {
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (!authorized) {
            return;
        }
        getAllUsers(courier)
            .then(response => setUsers(response.users))
            .catch(console.error);
    }, [courier, authorized]);

    return users;
}
