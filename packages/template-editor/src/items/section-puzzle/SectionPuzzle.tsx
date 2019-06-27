/** @jsx jsx */

import * as React from "react";
import { ISpecificPuzzleProps } from "entities";
import { Grid } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { InputField } from "components/fields";

interface ISectionPuzzleProps extends ISpecificPuzzleProps {
    title: string;
    isFocus?: boolean;
}

export const SectionPuzzle: React.FC<ISectionPuzzleProps> = ({ title, index, isFocus = true }) => {
    return (
        <Grid
            container
            alignItems="flex-end"
            spacing={2}
            css={theme => ({
                paddingTop: theme.spacing(3),
                paddingRight: theme.spacing(2),
                paddingBottom: theme.spacing(3),
                paddingLeft: theme.spacing(2),
            })}
        >
            <Grid container direction="column">
                <Grid
                    item
                    css={theme => ({
                        paddingLeft: theme.spacing(4),
                        paddingRight: theme.spacing(4),
                    })}
                >
                    <InputField
                        fullWidth={true}
                        placeholder="Название раздела"
                        isFocus={isFocus}
                        InputProps={{
                            style: {
                                fontSize: 26,
                                fontWeight: 500,
                                marginBottom: 20,
                            },
                        }}
                    />
                </Grid>
                <Grid
                    item
                    css={theme => ({
                        paddingLeft: theme.spacing(4),
                        paddingRight: theme.spacing(4),
                    })}
                    style={{
                        paddingBottom: 10,
                    }}
                >
                    <InputField
                        fullWidth={true}
                        placeholder="Описание раздела (необязательно)"
                        isFocus={isFocus}
                        InputProps={{
                            style: {
                                fontSize: 18,
                                fontWeight: 300,
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};
