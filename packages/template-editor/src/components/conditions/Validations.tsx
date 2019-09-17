/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button, InputField } from "@magnit/components";
import { ITemplate, IValidation } from "@magnit/entities";
import { AddIcon } from "@magnit/icons";
import { Grid, Typography } from "@material-ui/core";
import { useValidations } from "hooks/condition";
import * as React from "react";
import { Validation } from "./Validation";

interface IValidationsProps {
    initialState?: IValidation[];
    puzzleId: string;
    template: ITemplate;
    disabled?: boolean;
    focused?: boolean;

    onTemplateChange(template: ITemplate): void;
}

export const Validations: React.FC<IValidationsProps> = props => {
    const {
        initialState,
        puzzleId,
        template,
        disabled = false,
        focused = true,
        onTemplateChange,
    } = props;

    const [
        validations,
        questions,
        currentQuestion,
        errorMessage,
        onDeleteValidationCallback,
        onValidationChangeCallback,
        onAddValidationCallback,
        onErrorMessageChange,
        onErrorMessageBlurCallback,
    ] = useValidations(template, disabled, puzzleId, onTemplateChange, initialState);

    return (
        <Grid container spacing={2} css={{ marginBottom: 0 }} alignItems="center">
            {validations.map((validation, index) => (
                <Validation
                    key={validation.id}
                    validation={validation}
                    index={index}
                    currentQuestion={currentQuestion}
                    onDeleteValidation={onDeleteValidationCallback}
                    onValidationChange={onValidationChangeCallback}
                    questions={questions}
                    noDeleteButton={!focused}
                />
            ))}
            {focused && (
                <Grid item xs={3} css={theme => ({ marginLeft: theme.spacing(9) })}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={onAddValidationCallback}
                        scheme="outline"
                    >
                        <AddIcon css={theme => ({ color: theme.colors.primary })} />
                        <Typography css={theme => ({ fontSize: theme.fontSize.normal })}>
                            Добавить внутреннее условие
                        </Typography>
                    </Button>
                </Grid>
            )}
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs css={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            css={theme => ({ color: theme.colors.secondary })}
                            variant="subtitle1"
                        >
                            То
                        </Typography>
                    </Grid>
                    <Grid item xs={11} css={theme => ({ marginRight: theme.spacing(2) })}>
                        <InputField
                            value={errorMessage}
                            onChange={onErrorMessageChange}
                            onBlur={onErrorMessageBlurCallback}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

Validations.displayName = "Validations";
