/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IFocusedPuzzleProps, IPuzzle, ITemplate } from "entities";
import { Grid, TextField } from "@material-ui/core";
import { useState } from "react";
import { ETerminals } from "@magnit/services";
import { useCallback } from "react";
import { traverse } from "services/json";
import _ from "lodash";

interface IReferenceTextProps extends IFocusedPuzzleProps {
    template: ITemplate;
    text: string;

    onTemplateChange(template: ITemplate): void;
}

export const ReferenceText: React.FC<IReferenceTextProps> = ({ focused, ...props }) => {
    const [text, setText] = useState<string>(props.text);

    const onTemplateChange = useCallback(() => {
        traverse(props.template, (value: any) => {
            if (!_.has(value, "id")) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (puzzle.id !== props.id) {
                return;
            }
            puzzle.description = text;
            return true;
        });
        props.onTemplateChange({ ...props.template });
    }, [text]);

    function onTextChange(event: React.ChangeEvent<HTMLInputElement>) {
        setText(event.target.value);
    }

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
                onBlur={onTemplateChange}
            />
        </Grid>
    );
};
