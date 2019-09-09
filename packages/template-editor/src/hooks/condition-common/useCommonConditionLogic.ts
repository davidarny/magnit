import { EConditionType } from "@magnit/entities";
import { useCallback } from "react";

export function useCommonConditionLogic(
    index: number,
    conditionType: EConditionType,
): [() => string] {
    const getConditionLiteral = useCallback(() => {
        if (index === 0) {
            return "Если";
        }
        return {
            [EConditionType.AND]: "И",
            [EConditionType.OR]: "Или",
        }[conditionType];
    }, [conditionType, index]);

    return [getConditionLiteral];
}
