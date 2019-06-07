/** @jsx jsx */

import { jsx, css } from "@emotion/core";
import { PuzzleToolbar } from "components/puzzle";
import * as React from "react";

interface IWithToolbarProps {
    right?: number;
}

export const WithToolbar: React.FC<IWithToolbarProps> = ({ children, ...props }) => {
    return (
        <div
            css={css`
                position: relative;

                .toolbar {
                    display: none;
                }
            `}
        >
            {React.Children.map(children, (child, index) => {
                if (index === 0) {
                    return (
                        <div
                            css={css`
                                :hover ~ .toolbar {
                                    display: block;
                                }
                            `}
                        >
                            {child}
                        </div>
                    );
                }
                return child;
            })}
            <PuzzleToolbar {...props} />
        </div>
    );
};
