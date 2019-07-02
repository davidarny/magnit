/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps } from "entities";
import { Grid, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { InputField } from "components/fields";

interface ISectionPuzzleProps extends ISpecificPuzzleProps {
    title: string;
    focused: boolean;
}

export const SectionPuzzle: React.FC<ISectionPuzzleProps> = ({
    title,
    index,
    focused,
    children,
}) => {
    return (
        <React.Fragment>
            <Grid
                container
                alignItems="flex-end"
                justify="center"
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
                    <Typography
                        style={{
                            fontSize: 26,
                            marginBottom: 2,
                        }}
                    >
                        Раздел {index + 1}.
                    </Typography>
                </Grid>
                <Grid item xs style={{ display: "flex" }}>
                    <InputField
                        fullWidth
                        placeholder="Название раздела"
                        defaultValue={title}
                        isSimpleMode={!focused}
                        InputProps={{
                            style: {
                                fontSize: 26,
                            },
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container direction="column">
                {children}
            </Grid>
        </React.Fragment>
    );
};
