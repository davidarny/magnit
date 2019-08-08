/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IFocusedPuzzleProps, IPuzzle, ITemplate } from "entities";
import { Grid, Typography } from "@material-ui/core";
import { AddIcon } from "@magnit/icons";
import { Fab } from "@magnit/components";
import { Close as CloseIcon } from "@material-ui/icons";
import { useRef } from "react";
import _ from "lodash";
import { ETerminals } from "@magnit/services";

interface IReferenceAssetProps extends IFocusedPuzzleProps {
    title: string;
    description: string;
    template: ITemplate;
    // flag indication this asset should render
    // button which adds new asset when clicked
    addAssetButton: boolean;

    onTemplateChange(template: ITemplate): void;

    onUploadAsset(file: File): Promise<{ filename: string }>;

    onAddAsset(id: string, addition?: Partial<IPuzzle>): void;

    onDeleteAsset(filename: string): Promise<unknown>;

    onDeleteAssetPuzzle(id: string): void;
}

export const ReferenceAsset: React.FC<IReferenceAssetProps> = ({ focused, ...props }) => {
    const input = useRef<HTMLInputElement>(null);

    function onAddAsset() {
        if (input.current) {
            input.current.click();
        }
    }

    function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = _.first(event.target.files);
        if (!file) {
            return;
        }
        props.onUploadAsset(file).then(response => {
            props.onAddAsset(props.id, {
                title: _.get(file, "name", ETerminals.EMPTY),
                description: response.filename,
            });
        });
    }

    function onDeleteAsset() {
        const url = props.description;
        const filename = url.substring(url.lastIndexOf("/") + 1);
        props.onDeleteAsset(filename).then(() => props.onDeleteAssetPuzzle(props.id));
    }

    return (
        <Grid css={() => ({ ...(!focused ? { display: "none" } : {}) })} item xs={3}>
            <Grid
                container
                justify="center"
                alignItems="center"
                direction="column"
                css={theme => ({
                    height: "100%",
                    border: `1px solid ${theme.colors.lightGray}`,
                    borderRadius: theme.radius(0.5),
                    minHeight: theme.spacing(20),
                    position: "relative",
                })}
            >
                {!props.addAssetButton && (
                    <React.Fragment>
                        <img
                            css={theme => ({
                                width: "100%",
                                maxHeight: theme.spacing(20),
                            })}
                            alt={props.title}
                            src={props.description}
                        />
                        <div
                            onClick={onDeleteAsset}
                            css={theme => ({
                                padding: theme.spacing(0.5),
                                borderRadius: "50%",
                                background: theme.colors.gray,
                                color: theme.colors.white,
                                position: "absolute",
                                top: "-12px", // TODO: dynamic calculation
                                right: "-12px", // TODO: dynamic calculation
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                            })}
                        >
                            <CloseIcon css={theme => ({ fontSize: theme.fontSize.normal })} />
                        </div>
                    </React.Fragment>
                )}
                {props.addAssetButton && (
                    <React.Fragment>
                        <input
                            ref={input}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={onFileChange}
                        />
                        <Fab
                            css={theme => ({
                                width: theme.spacing(5),
                                height: theme.spacing(5),
                                marginBottom: theme.spacing(),
                            })}
                            onClick={onAddAsset}
                        >
                            <AddIcon />
                        </Fab>
                        <Typography
                            css={theme => ({
                                userSelect: "none",
                                fontSize: theme.fontSize.sNormal,
                                color: theme.colors.secondary,
                            })}
                            align="center"
                        >
                            Добавить фото
                        </Typography>
                    </React.Fragment>
                )}
            </Grid>
        </Grid>
    );
};
