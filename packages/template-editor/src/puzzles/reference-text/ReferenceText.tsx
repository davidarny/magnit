/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IFocusedPuzzleProps, IPuzzle, ITemplate } from "@magnit/entities";
import { Grid, TextField } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import { useCallback, useState } from "react";
import { traverse } from "services/json";

interface IReferenceTextProps extends IFocusedPuzzleProps {
    template: ITemplate;
    text: string;

    onTemplateChange(template: ITemplate): void;
}

export const ReferenceText: React.FC<IReferenceTextProps> = props => {
    const { id, focused, template, onTemplateChange } = props;
    const [text, setText] = useState<string>(props.text);

    const onTemplateChangeCallback = useCallback(() => {
        traverse(template, (value: any) => {
            if (!_.has(value, "id")) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (puzzle.id !== id) {
                return;
            }
            puzzle.description = text;
            return true;
        });
        onTemplateChange({ ...template });
    }, [onTemplateChange, id, template, text]);

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
                onBlur={onTemplateChangeCallback}
            />
        </Grid>
    );
};
