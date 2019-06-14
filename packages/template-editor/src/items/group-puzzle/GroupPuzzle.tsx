/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps, ITemplate } from "entities";
import { Grid, TextField, Typography, FormControlLabel, Checkbox } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { useState } from "react";
import { Conditions } from "components/conditions";

interface IGroupPuzzleProps extends ISpecificPuzzleProps {
    title: string;
    description: string;
    template: ITemplate;

    isFocused(id: string): boolean;
}

export const GroupPuzzle: React.FC<IGroupPuzzleProps> = ({ id, index, ...props }) => {
    const [conditionsEnabled, setConditionsEnabled] = useState(false);

    function onConditionsCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        setConditionsEnabled(event.target.checked);
    }

    return (
        <Grid container direction="column">
            <Grid item css={theme => ({ marginRight: theme.spacing(2) })}>
                <Typography variant="subtitle2">Группа {index + 1}.</Typography>
            </Grid>
            <Grid
                item
                css={css`
                    flex-grow: 1;
                `}
            >
                <TextField fullWidth label="Название группы" defaultValue={props.title} />
            </Grid>
            <Grid
                item
                css={css`
                    flex-grow: 1;
                `}
            >
                <TextField
                    fullWidth
                    label="Описание группы (необязательно)"
                    defaultValue={props.description}
                />
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
