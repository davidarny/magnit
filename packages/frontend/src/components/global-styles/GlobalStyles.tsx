/** @jsx jsx */
import { Global, jsx } from "@emotion/core";
import React from "react";

interface IGlobalStyleProps {
    section: {
        titleHeight: number;
        leftMargin: number;
    };
}

export const GlobalStyles: React.FC<IGlobalStyleProps> = props => {
    return (
        <Global
            styles={theme => ({
                ":root": {
                    "--section-title-height": `${props.section.titleHeight}px`,
                    "--section-left-margin": `${props.section.leftMargin}px`,
                },
                body: {
                    fontFamily: '"Roboto", sans-serif',
                    background: theme.colors.light,
                },
                "html, body": {
                    margin: 0,
                    height: "100%",
                    width: "100%",
                },
            })}
        />
    );
};
