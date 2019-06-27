import { Button } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { ButtonProps } from "@material-ui/core/Button";
import _ from "lodash";

export interface ICustomButtonProps {
    title?: string;
    icon?: React.ReactNode;
    buttonColor?: string;
}

export const CustomButton: React.FC<ICustomButtonProps & ButtonProps> = ({
    title = "",
    icon = "check",
    buttonColor = "blue",
    ...rest
}) => {
    const buttons = {
        main: {
            transaction: "0.25s",
            borderRadius: 40,
            width: 160,
            height: 40,
        },
        icon: {
            height: 24,
            width: 24,
        },
        blue: {
            color: "#FFFFFF",
            border: "1px solid #2F97FF",
            background: "#2F97FF !important",
            hover: {
                boxShadow: "0 8px 24px rgba(25, 140, 255, 0.5) !important",
            },
        },
        green: {
            color: "#FFFFFF",
            border: "1px solid #0CDAAC",
            background: "#0CDAAC !important",
            hover: {
                boxShadow: "0 8px 24px rgba(12, 218, 172, 0.5) !important",
            },
        },
        violet: {
            color: "#FFFFFF",
            border: "1px solid #8F7EE5",
            background: "#8F7EE5 !important",
            hover: {
                boxShadow: "0 8px 24px rgba(143, 126, 229, 0.5) !important",
            },
        },
        blueWithout: {
            color: "#2F97FF",
            border: "1px solid #2F97FF",
            background: "#FFFFFF !important",
            hover: {
                boxShadow: "0 8px 24px rgba(25, 140, 255, 0.5) !important",
            },
        },
    };

    const scheme = _.get(buttons, buttonColor);

    return (
        <Button
            css={{
                transaction: buttons.main.transaction,
                borderRadius: buttons.main.borderRadius,
                width: buttons.main.width,
                height: buttons.main.height,
                textTransform: "none",
                position: "relative",

                color: _.get(scheme, "color"),
                border: _.get(scheme, "border"),
                background: _.get(scheme, "background"),
                boxShadow: "none",
                ":hover": {
                    boxShadow: _.get(scheme, "hover.boxShadow"),
                },
            }}
            {...rest}
        >
            <div
                css={{
                    position: "absolute",
                    top: 8,
                    left: 12,
                }}
            >
                {icon}
            </div>
            <span>{title}</span>
        </Button>
    );
};
