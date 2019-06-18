/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps, ITemplate } from "entities";
import { Grid, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { Conditions } from "components/conditions";

interface IGroupPuzzleProps extends ISpecificPuzzleProps {
    template: ITemplate;

    isFocused(id: string): boolean;
}

export const GroupPuzzle: React.FC<IGroupPuzzleProps> = ({ id, index, ...props }) => {
    return (
        <Grid container direction="column">
            <Grid item css={theme => ({ marginRight: theme.spacing(2) })}>
                <Typography variant="h6">Группа связанных вопросов</Typography>
            </Grid>
            <Grid
                css={theme => ({
                    flexGrow: 1,
                    marginTop: theme.spacing(2),
                    opacity: !props.isFocused(id) ? 0.5 : 1,
                })}
                item
            >
                <Conditions puzzleId={id} template={props.template} />
            </Grid>
        </Grid>
    );
};
