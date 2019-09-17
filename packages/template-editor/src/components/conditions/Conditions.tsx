/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button } from "@magnit/components";
import { ICondition, ITemplate } from "@magnit/entities";
import { AddIcon } from "@magnit/icons";
import { Grid, Typography } from "@material-ui/core";
import { useConditions } from "hooks/condition";
import * as React from "react";
import { Condition } from "./Condition";

interface IConditionsProps {
    initialState?: ICondition[];
    puzzleId: string;
    template: ITemplate;
    disabled?: boolean;
    focused?: boolean;

    onTemplateChange(template: ITemplate): void;
}

export const Conditions: React.FC<IConditionsProps> = props => {
    const {
        initialState,
        puzzleId,
        template,
        disabled = false,
        focused = true,
        onTemplateChange,
    } = props;

    const [
        conditions,
        questions,
        answers,
        onConditionDeleteCallback,
        onConditionChangeCallback,
        onAddConditionCallback,
    ] = useConditions(template, disabled, puzzleId, onTemplateChange, initialState);

    return (
        <Grid container spacing={2} css={{ marginBottom: 0 }} alignItems="center">
            {conditions.map((condition, index) => (
                <Condition
                    key={condition.id}
                    answers={answers}
                    condition={condition}
                    conditions={conditions}
                    index={index}
                    onConditionChange={onConditionChangeCallback}
                    onConditionDelete={onConditionDeleteCallback}
                    questions={questions}
                    noDeleteButton={!focused}
                />
            ))}
            {focused && (
                <Grid item xs={4} css={theme => ({ marginLeft: theme.spacing(9) })}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={onAddConditionCallback}
                        scheme="outline"
                    >
                        <AddIcon css={theme => ({ color: theme.colors.primary })} />
                        <Typography css={theme => ({ fontSize: theme.fontSize.normal })}>
                            Добавить внутреннее условие
                        </Typography>
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};

Conditions.displayName = "Conditions";
