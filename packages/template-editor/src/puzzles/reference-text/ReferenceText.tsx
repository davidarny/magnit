/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IFocusedPuzzleProps } from "@magnit/entities";
import { Grid, TextField } from "@material-ui/core";
import * as React from "react";
import { useCallback, useState } from "react";

interface IReferenceTextProps extends IFocusedPuzzleProps {}

export const ReferenceText: React.FC<IReferenceTextProps> = props => {
    const { puzzle, focused, onTemplateChange } = props;

    const [text, setText] = useState<string>(puzzle.title);

    function onTextChange(event: React.ChangeEvent<HTMLInputElement>) {
        setText(event.target.value);
    }

    const onTextBlurCallback = useCallback(() => {
        puzzle.description = text;
        if (onTemplateChange) {
            onTemplateChange();
        }
    }, [onTemplateChange, puzzle.description, text]);

    return (
        <Grid
            css={theme => ({
                ...(!focused ? { display: "none" } : {}),
                marginBottom: theme.spacing(),
                div: {
                    ":before": { borderBottom: `1px solid ${theme.colors.default}42` },
                    ":after": { borderBottom: `2px solid ${theme.colors.primary}` },
                },
            })}
            item
            xs={12}
        >
            <TextField
                placeholder="Добавьте описание"
                fullWidth
                multiline
                value={text}
                onChange={onTextChange}
                onBlur={onTextBlurCallback}
            />
        </Grid>
    );
};
