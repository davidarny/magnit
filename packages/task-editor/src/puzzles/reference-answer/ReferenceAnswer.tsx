/** @jsx jsx */

import { jsx } from "@emotion/core";
import { ButtonLikeText } from "@magnit/components";

import { EPuzzleType } from "@magnit/entities";
import { Grid, TextField } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import React, { useState } from "react";
import { IPuzzleProps } from "services/item";

export const ReferenceAnswer: React.FC<IPuzzleProps> = props => {
    const { puzzle } = props;

    const [open, setOpen] = useState(false);

    const text = puzzle.puzzles.find(child => child.puzzleType === EPuzzleType.REFERENCE_TEXT);
    const assets = puzzle.puzzles.filter(child => child.puzzleType === EPuzzleType.REFERENCE_ASSET);

    function onOpenClick() {
        setOpen(!open);
    }

    return (
        <Grid item>
            <Grid container spacing={2}>
                <Grid
                    item
                    xs={12}
                    css={{
                        div: {
                            ":before": { content: "none" },
                            ":after": { content: "none" },
                        },
                    }}
                >
                    {text && (
                        <TextField
                            fullWidth
                            multiline
                            InputProps={{ readOnly: true }}
                            value={text.description}
                        />
                    )}
                </Grid>
                <Grid item xs={12}>
                    <ButtonLikeText
                        css={theme => ({ fontSize: theme.fontSize.normal })}
                        onClick={onOpenClick}
                    >
                        {assets.length} файл(a)
                        <ArrowDropDown
                            css={theme => ({
                                transform: open ? "rotate(-180deg)" : "none",
                                color: theme.colors.secondary,
                                verticalAlign: "bottom",
                            })}
                        />
                    </ButtonLikeText>
                </Grid>
                {!!assets.length &&
                    open &&
                    assets.map(asset => (
                        <Grid item xs={2}>
                            <Grid
                                container
                                justify="center"
                                alignItems="center"
                                direction="column"
                                css={theme => ({
                                    height: "100%",
                                    border: `1px solid ${theme.colors.lightGray}`,
                                    borderRadius: theme.radius(0.5),
                                    minHeight: theme.spacing(20),
                                    position: "relative",
                                })}
                            >
                                <img
                                    css={theme => ({
                                        width: "100%",
                                        objectFit: "contain",
                                        maxHeight: theme.spacing(20),
                                    })}
                                    alt={asset.title}
                                    src={asset.description}
                                />
                            </Grid>
                        </Grid>
                    ))}
            </Grid>
        </Grid>
    );
};
