/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button, InputField } from "@magnit/components";
import { SendIcon } from "@magnit/icons";
import * as React from "react";
import { useCallback, useState } from "react";

interface ISendReportFormProps {
    onSubmit(email: string): void;
}

export const SendReportForm: React.FC<ISendReportFormProps> = props => {
    const { onSubmit } = props;

    const [email, setEmail] = useState("");

    const onSubmitCallback = useCallback(
        (event: React.FormEvent) => {
            event.preventDefault();
            onSubmit(email);
        },
        [email, onSubmit],
    );

    function onEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

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
                onChange={onEmailChange}
                value={email}
                placeholder="Эл. почта"
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
                <SendIcon />
                Отправить
            </Button>
        </form>
    );
};
