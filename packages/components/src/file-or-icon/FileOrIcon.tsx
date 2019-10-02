/** @jsx jsx */

import { jsx } from "@emotion/core";
import { DocIcon, PdfIcon, XlsIcon } from "@magnit/icons";
import { Grid, Typography } from "@material-ui/core";
import React from "react";

interface IFileOrIconProps {
    src: string;
    filename: string;
    ext?: string;
}

export const FileOrIcon: React.FC<IFileOrIconProps> = props => {
    const { src, filename, ext = "" } = props;

    const file =
        ext.includes("pdf") ||
        ext.includes("doc") ||
        ext.includes("docx") ||
        ext.includes("xls") ||
        ext.includes("xlsx");

    if (file) {
        const pdf = ext.includes("pdf");
        const doc = ext.includes("doc");
        const docx = ext.includes("docx");
        const xls = ext.includes("xls");
        const xlsx = ext.includes("xlsx");
        return (
            <React.Fragment>
                <Grid
                    item
                    xs={12}
                    css={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {pdf && <PdfIcon />}
                    {(doc || docx) && <DocIcon />}
                    {(xls || xlsx) && <XlsIcon />}
                </Grid>
                <Grid item xs={12} css={{ textAlign: "center" }}>
                    <Typography
                        css={theme => ({
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            padding: `0 ${theme.spacing(2)}`,
                        })}
                    >
                        {filename}
                    </Typography>
                </Grid>
            </React.Fragment>
        );
    } else {
        return (
            <img
                css={theme => ({
                    width: "100%",
                    objectFit: "contain",
                    maxHeight: theme.spacing(20),
                })}
                alt={filename}
                src={src}
            />
        );
    }
};

FileOrIcon.displayName = "FileOrIcon";
