/** @jsx jsx */

import * as React from "react";
import { useEffect, useState } from "react";
import { Grid, Radio, TextField } from "@material-ui/core";
import { css, jsx } from "@emotion/core";
import { IPuzzle, ISpecificPuzzleProps, ITemplate } from "entities";
import { traverse } from "services/json";

type TChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

interface IRadioAnswerPuzzleProps extends ISpecificPuzzleProps {
    title: string;
    template: ITemplate;

    onTemplateChange(template: ITemplate): void;
}

export const RadioAnswerPuzzle: React.FC<IRadioAnswerPuzzleProps> = ({ template, ...props }) => {
    const [label, setLabel] = useState(props.title || `Вариант ${props.index + 1}`);

    useEffect(() => {
        traverse(template, (value: any) => {
            if (typeof value !== "object" || !("puzzles" in value)) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!("id" in puzzle) || puzzle.id !== props.id) {
                return;
            }
            puzzle.title = label;
        });
        props.onTemplateChange({ ...template });
    }, [label]);

    function onLabelChange(event: TChangeEvent): void {
        setLabel(event.target.value as string);
    }

    return (
        <Grid container alignItems="center">
            <Grid item xs={1}>
                <Radio
                    disabled
                    checked
                    css={css`
                        padding-left: 0;
                    `}
                />
            </Grid>
            <Grid item xs={11}>
                <TextField fullWidth value={label} onChange={onLabelChange} />
            </Grid>
        </Grid>
    );
};
