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

export const RadioAnswerPuzzle: React.FC<IRadioAnswerPuzzleProps> = ({ id, index, ...props }) => {
    const [label, setLabel] = useState(props.title || `Вариант ${index + 1}`);

    useEffect(() => {
        traverse(props.template, (value: any) => {
            if (typeof value !== "object" || !("puzzles" in value)) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!("id" in puzzle) || puzzle.id !== id) {
                return;
            }
            puzzle.title = label;
        });
        props.onTemplateChange({ ...props.template });
    }, [label]);

    function onLabelChange(event: TChangeEvent): void {
        setLabel(event.target.value as string);
    }

    return (
        <Grid container alignItems="center">
            <Grid item xs={1}>
                <Radio
                    disabled
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
