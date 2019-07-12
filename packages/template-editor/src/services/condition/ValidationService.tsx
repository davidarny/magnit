/** @jsx jsx */

import * as React from "react";
import {
    IValidationService,
    IValidationServiceOptions,
    TGetRightHandPuzzleResult,
} from "./IValidationService";
import { ServiceImpl } from "./ServiceImpl";
import { MenuItem } from "@material-ui/core";
import { EOperatorType, EValidationType, IPuzzle, TChangeEvent } from "entities";
import { jsx } from "@emotion/core";
import { InputField, SelectField } from "@magnit/components";
import { ETerminals } from "@magnit/services";

export class ValidationService extends ServiceImpl implements IValidationService {
    constructor(protected readonly options: IValidationServiceOptions) {
        super(options);
    }

    private static getOperatorLiteral(operatorType: EOperatorType): string {
        return {
            [EOperatorType.MORE_THAN]: "Больше чем",
            [EOperatorType.LESS_THAN]: "Меньше чем",
            [EOperatorType.LESS_OR_EQUAL]: "Меньше или равно",
            [EOperatorType.MORE_OR_EQUAL]: "Больше или равно",
            [EOperatorType.EQUAL]: "Равно",
            [EOperatorType.NONE]: ETerminals.EMPTY,
        }[operatorType];
    }

    private static getValidationLiteral(validationType: EValidationType): string {
        return {
            [EValidationType.COMPARE_WITH_ANSWER]: "Сравнить с ответом",
            [EValidationType.SET_VALUE]: "Установить значение",
            [EValidationType.NONE]: ETerminals.EMPTY,
        }[validationType];
    }

    getOperatorVariants(): React.ReactNode {
        return [
            <MenuItem key={EOperatorType.EQUAL} value={EOperatorType.EQUAL}>
                {ValidationService.getOperatorLiteral(EOperatorType.EQUAL)}
            </MenuItem>,
            <MenuItem key={EOperatorType.MORE_THAN} value={EOperatorType.MORE_THAN}>
                {ValidationService.getOperatorLiteral(EOperatorType.MORE_THAN)}
            </MenuItem>,
            <MenuItem key={EOperatorType.LESS_THAN} value={EOperatorType.LESS_THAN}>
                {ValidationService.getOperatorLiteral(EOperatorType.LESS_THAN)}
            </MenuItem>,
            <MenuItem key={EOperatorType.MORE_OR_EQUAL} value={EOperatorType.MORE_OR_EQUAL}>
                {ValidationService.getOperatorLiteral(EOperatorType.MORE_OR_EQUAL)}
            </MenuItem>,
            <MenuItem key={EOperatorType.LESS_OR_EQUAL} value={EOperatorType.LESS_OR_EQUAL}>
                {ValidationService.getOperatorLiteral(EOperatorType.LESS_OR_EQUAL)}
            </MenuItem>,
        ];
    }

    getRightHandPuzzle(questions: IPuzzle[]): TGetRightHandPuzzleResult {
        const { validation } = this.options;
        switch (validation.validationType) {
            case EValidationType.COMPARE_WITH_ANSWER:
                return (onRightHandPuzzleChange: (event: TChangeEvent) => void) => {
                    return (
                        <SelectField
                            fullWidth
                            placeholder="Выберите вопрос"
                            onChange={onRightHandPuzzleChange}
                            value={validation.rightHandPuzzle || ETerminals.EMPTY}
                        >
                            {questions.length !== 0 &&
                                questions.map(question => {
                                    return (
                                        <MenuItem key={question.id} value={question.id}>
                                            {question.title}
                                        </MenuItem>
                                    );
                                })}
                        </SelectField>
                    );
                };
            case EValidationType.SET_VALUE:
            default:
                return (onValueChange: (event: TChangeEvent) => void) => {
                    return (
                        <InputField
                            fullWidth
                            value={validation.value}
                            onChange={onValueChange}
                            css={theme => ({ marginTop: theme.spacing(-2) })}
                            placeholder="Ответ"
                        />
                    );
                };
        }
    }

    getValidationVariants(): React.ReactNode {
        return [
            <MenuItem
                key={EValidationType.COMPARE_WITH_ANSWER}
                value={EValidationType.COMPARE_WITH_ANSWER}
            >
                {ValidationService.getValidationLiteral(EValidationType.COMPARE_WITH_ANSWER)}
            </MenuItem>,
            <MenuItem key={EValidationType.SET_VALUE} value={EValidationType.SET_VALUE}>
                {ValidationService.getValidationLiteral(EValidationType.SET_VALUE)}
            </MenuItem>,
        ];
    }
}
