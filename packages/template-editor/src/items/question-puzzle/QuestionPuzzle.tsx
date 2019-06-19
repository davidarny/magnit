/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps, ITemplate } from "entities";
import { Checkbox, FormControlLabel, Grid, TextField, Typography } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { Conditions } from "components/conditions";
import { useState } from "react";

interface IQuestionPuzzleProps extends ISpecificPuzzleProps {
    template: ITemplate;
    title: string;

    isFocused(id: string): boolean;
}

export const QuestionPuzzle: React.FC<IQuestionPuzzleProps> = ({ title, index, id, ...props }) => {
    const [conditionsEnabled, setConditionsEnabled] = useState(false);

    function onConditionsCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        setConditionsEnabled(event.target.checked);
    }

    return (
        <Grid container direction="column">
            <Grid item>
                <Grid container alignItems="flex-end">
                    <Grid item css={theme => ({ marginRight: theme.spacing(2) })}>
                        <Typography variant="body1">{index + 1}.</Typography>
                    </Grid>
                    <Grid
                        item
                        css={css`
                            flex-grow: 1;
                        `}
                    >
                        <TextField fullWidth label="Название вопроса" defaultValue={title} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                css={css`
                    flex-grow: 1;
                `}
            >
                {props.isFocused(id) && (
                    <FormControlLabel
                        css={theme => ({ marginTop: theme.spacing(2) })}
                        control={
                            <Checkbox
                                checked={conditionsEnabled}
                                onChange={onConditionsCheckboxChange}
                                color="primary"
                            />
                        }
                        label="Условия показа группы"
                    />
                )}
            </Grid>
            {conditionsEnabled && (
                <Grid
                    css={theme => ({
                        flexGrow: 1,
                        marginTop: theme.spacing(2),
                        opacity: !props.isFocused(id) ? 0.5 : 1,
                        pointerEvents: !props.isFocused(id) ? "none" : "initial",
                    })}
                    item
                >
                    <Conditions puzzleId={id} template={props.template} />
                </Grid>
            )}
        </Grid>
    );
};
