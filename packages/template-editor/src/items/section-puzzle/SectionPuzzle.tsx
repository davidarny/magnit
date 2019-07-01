/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps } from "entities";
import { Grid, TextField, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";

interface ISectionPuzzleProps extends ISpecificPuzzleProps {
    title: string;
}

export const SectionPuzzle: React.FC<ISectionPuzzleProps> = ({ title, index }) => {
    return (
        <Grid
            container
            alignItems="flex-end"
            spacing={2}
            css={theme => ({
                paddingLeft: theme.spacing(4),
                paddingRight: theme.spacing(4),
            })}
            style={{
                paddingBottom: 10,
            }}
        >
            <Grid item>
                <Typography variant="h6">Раздел {index + 1}.</Typography>
            </Grid>
            <Grid
                item
                style={{
                    display: "flex",
                    flexGrow: 1,
                }}
            >
                <TextField fullWidth label="Название раздела" defaultValue={title} />
            </Grid>
        </Grid>
    );
};
