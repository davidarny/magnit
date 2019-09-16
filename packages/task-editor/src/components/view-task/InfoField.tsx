/** @jsx jsx */

import { jsx } from "@emotion/core";
import { ButtonLikeText } from "@magnit/components";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";

interface IInfoField {
    title: string;
    value: string;
    editable?: boolean;
    label?: string;

    onEditableClick?(): void;
}

export const InfoField: React.FC<IInfoField> = props => {
    const { title, value, editable, label, onEditableClick } = props;
    return (
        <Grid item xs>
            <Typography
                css={theme => ({
                    color: theme.colors.secondary,
                    fontSize: theme.fontSize.smaller,
                    textTransform: "uppercase",
                })}
            >
                {title}
            </Typography>
            <Typography
                css={theme => ({
                    fontSize: theme.fontSize.normal,
                    color: theme.colors.black,
                })}
            >
                {value}
            </Typography>
            {editable && <ButtonLikeText onClick={onEditableClick}>{label}</ButtonLikeText>}
        </Grid>
    );
};

InfoField.displayName = "InfoField";
