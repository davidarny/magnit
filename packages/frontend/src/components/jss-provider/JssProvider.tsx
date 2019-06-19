/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { JssProvider as ReactJssProvider } from "react-jss";
import { create, GenerateClassName, JSSOptions } from "jss";
import { createGenerateClassName, jssPreset } from "@material-ui/styles";

const generateClassName = (createGenerateClassName() as unknown) as GenerateClassName;
const insertionPoint = document.getElementById("jss-insertion-point") as HTMLElement;
const jssOptions = (jssPreset() as unknown) as Partial<JSSOptions>;
const jss = create({
    ...jssOptions,
    insertionPoint: insertionPoint,
});

const JssProvider: React.FC = ({ children }) => {
    return (
        <ReactJssProvider jss={jss} generateClassName={generateClassName}>
            {children}
        </ReactJssProvider>
    );
};

export default JssProvider;
