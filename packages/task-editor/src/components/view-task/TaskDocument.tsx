/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Checkbox, SelectableBlockWrapper, SelectField } from "@magnit/components";
import {
    IComment,
    IExtendedDocument,
    ITemplate,
    ITemplateDocument,
    IVirtualTemplateDocument,
} from "@magnit/entities";
import { IEditorService } from "@magnit/services";
import {
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Typography,
} from "@material-ui/core";
import { TemplateRenderer } from "components/renderers";
import _ from "lodash";
import * as React from "react";
import { useCallback } from "react";
import { Comment } from "./Comment";
import { PendingComment } from "./PendingComment";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

interface ITaskDocumentProps {
    documents: IVirtualTemplateDocument[];
    document: IVirtualTemplateDocument;
    service: IEditorService;
    focusedPuzzleId?: string;
    templateSnapshots: Map<string, ITemplate>;
    templates: Array<ITemplateDocument & IExtendedDocument>;
    editable: boolean;
    pendingComments: IComment[];
    comments: IComment[];

    onEditableChange?(documentId: number, editable: boolean): void;

    onTemplateChange?(uuid: string, event: TSelectChangeEvent): void;

    onPendingCommentDelete?(commentId: number): void;

    onPendingCommentAccept?(comment: IComment): void;

    onCommentDelete?(commentId: number): void;
}

export const TaskDocument: React.FC<ITaskDocumentProps> = props => {
    const {
        focusedPuzzleId,
        service,
        document,
        templates,
        documents,
        templateSnapshots,
        editable,
        pendingComments,
        comments,
        onEditableChange,
        onTemplateChange,
        onPendingCommentDelete,
        onPendingCommentAccept,
        onCommentDelete,
    } = props;

    const snapshot = templateSnapshots.get(document.id.toString());
    const focused = focusedPuzzleId === document.__uuid;

    const answers = templates
        .filter(template => template.id === document.id)
        .flatMap(template => template.answers || []);

    const onEditableChangeCallback = useCallback(
        (event: TSelectChangeEvent, checked: boolean) => {
            if (onEditableChange) {
                onEditableChange(document.id, checked);
            }
        },
        [document.id, onEditableChange],
    );

    const onTemplateChangeCallback = useCallback(
        (event: TSelectChangeEvent) => {
            if (onTemplateChange) {
                onTemplateChange(document.__uuid, event);
            }
        },
        [document.__uuid, onTemplateChange],
    );

    return (
        <SelectableBlockWrapper
            onFocus={service.onPuzzleFocus.bind(service, document.__uuid, false)}
            onMouseDown={service.onPuzzleFocus.bind(service, document.__uuid, false)}
            css={theme => ({
                padding: theme.spacing(3),
                zIndex: focusedPuzzleId === document.__uuid ? 1300 : "initial",
            })}
            focused={focused}
            id={document.__uuid}
        >
            {editable && document.virtual && (
                <Grid item xs={3} css={theme => ({ paddingLeft: theme.spacing(3) })}>
                    <SelectField
                        placeholder="Выбрать шаблон"
                        value={document.id === -1 ? "" : document.id}
                        fullWidth
                        onChange={onTemplateChangeCallback}
                    >
                        {templates
                            .filter(template =>
                                document.id !== template.id
                                    ? !documents.find(document => document.id === template.id)
                                    : true,
                            )
                            .map(template => (
                                <MenuItem key={template.id} value={template.id}>
                                    {template.title}
                                </MenuItem>
                            ))}
                    </SelectField>
                </Grid>
            )}
            <Grid container css={theme => ({ padding: `0 ${theme.spacing(4)}` })}>
                <Grid item xs={9}>
                    <Typography css={theme => ({ fontSize: theme.fontSize.xLarge })}>
                        {_.get(snapshot, "title")}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Grid container justify="center" alignItems="flex-end">
                        <FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled={!editable}
                                        checked={document.editable}
                                        css={theme => ({ marginRight: theme.spacing() })}
                                        onChange={onEditableChangeCallback}
                                    />
                                }
                                label="Разрешить редактирование"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {focused && <TemplateRenderer answers={answers} template={snapshot} />}
                </Grid>
                {!!comments.length && (
                    <React.Fragment>
                        <Grid item xs={12} css={theme => ({ marginTop: theme.spacing(3) })}>
                            <Divider variant="fullWidth" />
                        </Grid>
                        <Grid item xs={12} css={theme => ({ marginTop: theme.spacing(3) })}>
                            {comments.map(comment => (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                    onCommentDelete={onCommentDelete}
                                />
                            ))}
                        </Grid>
                    </React.Fragment>
                )}
                <Grid item xs={12} css={theme => ({ marginTop: theme.spacing(3) })}>
                    {pendingComments.map(comment => (
                        <PendingComment
                            key={comment.id}
                            comment={comment}
                            onCommentDelete={onPendingCommentDelete}
                            onCommentAccept={onPendingCommentAccept}
                        />
                    ))}
                </Grid>
            </Grid>
        </SelectableBlockWrapper>
    );
};

TaskDocument.displayName = "TaskDocument";
