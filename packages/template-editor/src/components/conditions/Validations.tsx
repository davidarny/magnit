/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button, InputField } from "@magnit/components";
import { IPuzzle, ISection, IValidation } from "@magnit/entities";
import { AddIcon } from "@magnit/icons";
import { Grid, Typography } from "@material-ui/core";
import { useValidations } from "hooks/condition";
import { useOutsideListener } from "hooks/shared";
import _ from "lodash";
import { useEffect } from "react";
import * as React from "react";
import { useRef } from "react";
import { Validation } from "./Validation";

interface IValidationsProps {
    puzzle: IPuzzle;
    parent: IPuzzle | ISection;
    puzzles: Map<string, IPuzzle>;
    disabled?: boolean;
    focused?: boolean;

    onTemplateChange(): void;
}

export const Validations: React.FC<IValidationsProps> = props => {
    const { puzzle, parent, puzzles, disabled = false, focused = true, onTemplateChange } = props;

    const [
        virtualCondition,
        questions,
        errorMessage,
        onDeleteValidationCallback,
        onValidationChangeCallback,
        onAddValidationCallback,
        onErrorMessageChange,
        onErrorMessageBlurCallback,
        onValidationsBlur,
    ] = useValidations(puzzle, puzzles, disabled, onTemplateChange, parent);

    const container = useRef<HTMLDivElement | null>(null);
    useOutsideListener(container, focused ? onValidationsBlur : _.noop);

    const prevFocused = useRef(focused);
    useEffect(() => {
        if (prevFocused.current && !focused) {
            prevFocused.current = focused;
            onValidationsBlur();
        }
    }, [focused, onValidationsBlur]);

    return (
        <Grid container ref={container} spacing={2} css={{ marginBottom: 0 }} alignItems="center">
            {[...puzzle.validations, virtualCondition]
                .filter<IValidation>(
                    (validation): validation is IValidation => !_.isNil(validation),
                )
                .map((validation, index) => (
                    <Validation
                        key={validation.id}
                        validation={validation}
                        index={index}
                        puzzle={puzzle}
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
