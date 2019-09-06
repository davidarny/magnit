/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField, SelectField } from "@magnit/components";
import { EOperatorType, EValidationType, IPuzzle } from "@magnit/entities";
import { MenuItem } from "@material-ui/core";
import * as React from "react";
import {
    IRightHandPuzzleBuilder,
    IValidationService,
    IValidationServiceOptions,
} from "./IValidationService";
import { ServiceImpl } from "./ServiceImpl";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

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
        }[operatorType];
    }

    private static getValidationLiteral(validationType: EValidationType): string {
        return {
            [EValidationType.COMPARE_WITH_ANSWER]: "Сравнить с ответом",
            [EValidationType.SET_VALUE]: "Установить значение",
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

    getRightHandPuzzle(questions: IPuzzle[]): IRightHandPuzzleBuilder {
        const self = this;
        return new (class implements IRightHandPuzzleBuilder {
            private onRightHandPuzzleChange?: (event: TSelectChangeEvent) => void;
            private onValueChange?: (event: TSelectChangeEvent) => void;
            private onValueBlur?: () => void;

            build(): React.ReactNode {
                const { validationType, rightHandPuzzle } = self.options.validation;
                const { value } = self.options;
                if (validationType === EValidationType.COMPARE_WITH_ANSWER) {
                    return (
                        <SelectField
                            fullWidth
                            placeholder="Выберите вопрос"
                            onChange={this.onRightHandPuzzleChange}
                            value={rightHandPuzzle || ""}
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
                } else if (validationType === EValidationType.SET_VALUE) {
                    return (
                        <InputField
                            fullWidth
                            value={value || ""}
                            onChange={this.onValueChange}
                            onBlur={this.onValueBlur}
                            css={theme => ({ marginTop: theme.spacing(-2) })}
                            placeholder="Ответ"
                        />
                    );
                } else {
                    return <React.Fragment />;
                }
            }

            setRightHandPuzzleChangeHandler(
                handler: (event: TSelectChangeEvent) => void,
            ): IRightHandPuzzleBuilder {
                this.onRightHandPuzzleChange = handler;
                return this;
            }

            setValueBlurHandler(handler: () => void): IRightHandPuzzleBuilder {
                this.onValueBlur = handler;
                return this;
            }

            setValueChangeHandler(
                handler: (event: TSelectChangeEvent) => void,
            ): IRightHandPuzzleBuilder {
                this.onValueChange = handler;
                return this;
            }
        })();
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
