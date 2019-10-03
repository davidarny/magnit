/** @jsx jsx */

import { jsx } from "@emotion/core";
import { AssetPreview, Fab } from "@magnit/components";
import { IFocusedPuzzleProps } from "@magnit/entities";
import { AddIcon } from "@magnit/icons";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";

export const UploadFilesAnswer: React.FC<IFocusedPuzzleProps> = ({ focused }) => {
    return (
        <Grid item xs={2}>
            <AssetPreview
                css={{
                    ...(!focused ? { display: "none" } : {}),
                    flexDirection: "column",
                    opacity: 0.8,
                    pointerEvents: "none",
                }}
                render={() => (
                    <React.Fragment>
                        <Grid item xs={12}>
                            <Fab
                                css={theme => ({
                                    width: theme.spacing(4),
                                    height: theme.spacing(4),
                                    minHeight: theme.spacing(4),
                                    marginBottom: theme.spacing(),
                                })}
                            >
                                <AddIcon />
                            </Fab>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                css={theme => ({
                                    userSelect: "none",
                                    fontSize: theme.fontSize.sNormal,
                                    color: theme.colors.secondary,
                                })}
                                align="center"
                            >
                                Добавить файл
                            </Typography>
                        </Grid>
                    </React.Fragment>
                )}
            />
        </Grid>
    );
};
