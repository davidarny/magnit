/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IComment } from "@magnit/entities";
import { getFriendlyDate } from "@magnit/services";
import { Grid, IconButton, Typography } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import React, { useCallback } from "react";

export interface ICommentProps {
    comment: IComment;

    onCommentDelete?(commentId: number): void;
}

export const Comment: React.FC<ICommentProps> = props => {
    const { comment, onCommentDelete } = props;

    const onCommentDeleteCallback = useCallback(() => {
        if (onCommentDelete) {
            onCommentDelete(comment.id);
        }
    }, [comment.id, onCommentDelete]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={11}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography
                            component="span"
                            css={theme => ({
                                color: theme.colors.gray,
                                fontSize: theme.fontSize.sNormal,
                                marginRight: theme.spacing(2),
                            })}
                        >
                            Рукастый Иннокентий Петрович
                        </Typography>
                        <Typography
                            component="span"
                            css={theme => ({
                                color: theme.colors.lightGray,
                                fontSize: theme.fontSize.sNormal,
                            })}
                        >
                            {getFriendlyDate(new Date(comment.createdAt))}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography css={theme => ({ fontSize: theme.fontSize.normal })}>
                            {comment.text}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={1} css={{ display: "flex", justifyContent: "center" }}>
                <IconButton onClick={onCommentDeleteCallback}>
                    <CloseIcon css={theme => ({ fontSize: theme.fontSize.normal })} />
                </IconButton>
            </Grid>
        </Grid>
    );
};

Comment.displayName = "Comment";
