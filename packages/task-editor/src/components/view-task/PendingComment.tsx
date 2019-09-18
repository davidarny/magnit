/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField } from "@magnit/components";
import { IComment } from "@magnit/entities";
import { Grid, IconButton } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import React, { useCallback, useState } from "react";

export interface IPendingCommentProps {
    comment: IComment;

    onCommentAccept?(comment: IComment): void;

    onCommentDelete?(commentId: number): void;
}

export const PendingComment: React.FC<IPendingCommentProps> = props => {
    const { comment, onCommentAccept, onCommentDelete } = props;

    const [text, setText] = useState("");

    function onTextChange(event: React.ChangeEvent<HTMLInputElement>) {
        setText(event.target.value);
    }

    const onInputBlurCallback = useCallback(() => {
        if (onCommentAccept && !!text) {
            onCommentAccept({ ...comment, text });
        }
    }, [comment, onCommentAccept, text]);

    const onCommentDeleteCallback = useCallback(() => {
        if (onCommentDelete) {
            onCommentDelete(comment.id);
        }
    }, [comment.id, onCommentDelete]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={11}>
                <InputField
                    variant="filled"
                    onBlur={onInputBlurCallback}
                    onChange={onTextChange}
                    fullWidth
                    css={theme => ({
                        input: { paddingTop: "10px" },
                        "> div": {
                            borderRadius: theme.radius(2),
                            "&:after, &:before": { content: "none" },
                        },
                    })}
                />
            </Grid>
            <Grid item xs={1} css={{ display: "flex", justifyContent: "center" }}>
                <IconButton onClick={onCommentDeleteCallback}>
                    <CloseIcon css={theme => ({ fontSize: theme.fontSize.normal })} />
                </IconButton>
            </Grid>
        </Grid>
    );
};

PendingComment.displayName = "PendingComment";
