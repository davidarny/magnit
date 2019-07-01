/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps, ITemplate } from "entities";
import { Grid, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";

interface IGroupPuzzleProps extends ISpecificPuzzleProps {
    template: ITemplate;
    focused: boolean;

    onTemplateChange(template: ITemplate): void;
}

export const GroupPuzzle: React.FC<IGroupPuzzleProps> = ({ id, index, ...props }) => {
    return (
        <Grid container direction="column">
            <Grid item css={theme => ({ marginRight: theme.spacing(2) })}>
                <Typography variant="h6">Группа связанных вопросов</Typography>
            </Grid>
        </Grid>
    );
};
