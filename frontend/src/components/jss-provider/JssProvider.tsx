/** @jsx jsx */

import { jsx } from "@emotion/core";
import { jssPreset, StylesProvider } from "@material-ui/styles";
import { create } from "jss";
import * as React from "react";

const insertionPoint = document.getElementById("jss-insertion-point");

const jss = create({
    ...jssPreset(),
    insertionPoint: insertionPoint!,
});

export const JssProvider: React.FC = ({ children }) => {
    return <StylesProvider jss={jss}>{children}</StylesProvider>;
};

JssProvider.displayName = "JssProvider";
