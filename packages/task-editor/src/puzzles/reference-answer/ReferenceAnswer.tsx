/** @jsx jsx */

import { jsx } from "@emotion/core";
import { AssetPreview, ButtonLikeText } from "@magnit/components";
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
                            <AssetPreview
                                filename={asset.title}
                                src={asset.description}
                                ext={asset.description.split(".").pop()}
                            />
                        </Grid>
                    ))}
            </Grid>
        </Grid>
    );
};

ReferenceAnswer.displayName = "ReferenceAnswer";
