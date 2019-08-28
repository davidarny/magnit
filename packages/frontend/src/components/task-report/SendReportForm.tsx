/** @jsx jsx */

import { Button, InputField } from "@magnit/components";
import { Send } from "@material-ui/icons";
import { useCallback, useState } from "react";
import * as React from "react";
import { jsx } from "@emotion/core";

interface IProps {
    onSubmit(email: string): void;
}

export const SendReportForm: React.FC<IProps> = props => {
    const { onSubmit } = props;

    const [email, setEmail] = useState("");

    const onSubmitCallback = useCallback(
        (event: React.FormEvent) => {
            event.preventDefault();
            onSubmit(email);
        },
        [email, onSubmit],
    );

    return (
        <form action="" onSubmit={onSubmitCallback}>
            <div
                css={theme => ({
                    fontSize: theme.fontSize.larger,
                    marginBottom: theme.spacing(2),
                })}
            >
                Введите email, на который будет отправлен отчет
            </div>
            <InputField
                onChange={e => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                autoFocus
                type="email"
                required
                fullWidth
            />
            <Button
                type="submit"
                css={theme => ({
                    display: "flex",
                    margin: `${theme.spacing(6)} auto 0`,
                })}
            >
                <Send
                    css={theme => ({
                        fontSize: theme.fontSize.normal,
                        marginRight: theme.spacing(),
                    })}
                />
                Отправить
            </Button>
        </form>
    );
};
