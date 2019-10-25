/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid, IconButton } from "@material-ui/core";
import {
    KeyboardArrowLeft as LeftArrowIcon,
    KeyboardArrowRight as RightArrowIcon,
} from "@material-ui/icons";
import * as _ from "lodash";
import * as React from "react";

interface ITablePaginationProps {
    count: number;
    page: number;
    rowsPerPage: number;

    onChangePage(event: React.MouseEvent<HTMLButtonElement> | null, page: number): void;
}

export const TablePagination: React.FC<ITablePaginationProps> = props => {
    const { count, page, rowsPerPage, onChangePage } = props;

    // some stuff to correctly calculate
    // left & right offsets when changing page
    const range = {
        offsets: {
            start: 1,
            end: 2,
        },

        get start() {
            if (page === Math.ceil(count / rowsPerPage) - 1) {
                this.offsets.start++;
            }
            return Math.max(0, page - this.offsets.start);
        },

        get end() {
            if (page === 0) {
                this.offsets.end++;
            }
            return Math.max(0, Math.min(page + this.offsets.end, Math.ceil(count / rowsPerPage)));
        },
    };

    function onBackButtonClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        onChangePage(event, page - 1);
    }

    function onNextButtonClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        onChangePage(event, page + 1);
    }

    function onActionButtonClick(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        page: number,
    ) {
        onChangePage(event, page);
    }

    return (
        <Grid
            container
            alignItems="center"
            css={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: 0,
                width: "auto",
            }}
        >
            <Grid item>
                <IconButton
                    onClick={onBackButtonClick}
                    disabled={page === 0}
                    css={theme => ({
                        width: theme.spacing(4),
                        height: theme.spacing(4),
                        marginLeft: theme.spacing(2),
                        svg: {
                            width: theme.spacing(3),
                            height: theme.spacing(3),
                        },
                    })}
                >
                    <LeftArrowIcon />
                </IconButton>
            </Grid>
            {_.range(range.start, range.end).map((action, index) => (
                <Grid item key={index}>
                    <IconButton
                        onClick={event => onActionButtonClick(event, action)}
                        disabled={action === page}
                        css={theme => ({
                            width: theme.spacing(4),
                            height: theme.spacing(4),
                            fontSize: theme.fontSize.normal,
                            color:
                                (action === page ? theme.colors.white : theme.colors.secondary) +
                                " !important",
                            background:
                                (action === page ? theme.colors.primary : theme.colors.white) +
                                " !important",
                        })}
                    >
                        {action + 1}
                    </IconButton>
                </Grid>
            ))}
            <Grid item>
                <IconButton
                    onClick={onNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    css={theme => ({
                        width: theme.spacing(4),
                        height: theme.spacing(4),
                        marginRight: theme.spacing(2),
                        svg: {
                            width: theme.spacing(3),
                            height: theme.spacing(3),
                        },
                    })}
                >
                    <RightArrowIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
};

TablePagination.displayName = "TablePagination";
