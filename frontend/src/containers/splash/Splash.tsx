/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Button, InputField } from "@magnit/components";
import { Grid } from "@material-ui/core";
import { RouteComponentProps } from "@reach/router";
import splash from "assets/splash.png";
import { CenteredGrid } from "components/centered-section-item";
import { SectionLayout } from "components/section-layout";
import React, { useCallback, useState } from "react";
import { LogoIcon } from "./Logo";

interface ISplashProps extends RouteComponentProps {
    onUsernameChange?(username: string): void;

    onPasswordChange?(password: string): void;

    onLogin?(username: string, password: string): void;
}

export const Splash: React.FC<ISplashProps> = props => {
    const { onLogin, onUsernameChange, onPasswordChange } = props;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }

    const handleUsernameBlur = useCallback(() => {
        if (onUsernameChange) {
            onUsernameChange(username);
        }
    }, [onUsernameChange, username]);

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    const handlePasswordBlur = useCallback(() => {
        if (onPasswordChange) {
            onPasswordChange(password);
        }
    }, [onPasswordChange, password]);

    const handleSignIn = useCallback(() => {
        if (onLogin && username && password) {
            onLogin(username, password);
        }
    }, [username, password, onLogin]);

    return (
        <SectionLayout css={theme => ({ background: theme.colors.primary })}>
            <CenteredGrid>
                <Grid
                    container
                    css={theme => ({
                        maxWidth: theme.spacing(150),
                        background: theme.colors.white,
                        borderRadius: theme.radius(),
                        overflow: "hidden",
                    })}
                    alignItems="center"
                >
                    <Grid item css={{ display: "flex" }} xs={8}>
                        <img
                            css={{ width: "100%", maxHeight: "100vh" }}
                            src={splash}
                            alt="splash"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justify="space-around">
                            <CenteredGrid
                                css={({ spacing }) => ({
                                    marginBottom: spacing(15),
                                    padding: `0 ${spacing(6)}`,
                                })}
                                xs={12}
                            >
                                <LogoIcon />
                            </CenteredGrid>
                            <CenteredGrid
                                css={({ spacing }) => ({
                                    marginBottom: spacing(8),
                                    padding: `0 ${spacing(6)}`,
                                })}
                                xs={12}
                            >
                                <InputField
                                    fullWidth
                                    value={username}
                                    placeholder="Логин"
                                    onChange={handleUsernameChange}
                                    onBlur={handleUsernameBlur}
                                />
                            </CenteredGrid>
                            <CenteredGrid
                                css={({ spacing }) => ({
                                    marginBottom: spacing(10),
                                    padding: `0 ${spacing(6)}`,
                                })}
                                xs={12}
                            >
                                <InputField
                                    fullWidth
                                    value={password}
                                    type="password"
                                    placeholder="Пароль"
                                    onChange={handlePasswordChange}
                                    onBlur={handlePasswordBlur}
                                />
                            </CenteredGrid>
                            <CenteredGrid xs={12}>
                                <Button
                                    onClick={handleSignIn}
                                    css={({ spacing }) => ({ width: spacing(20) })}
                                >
                                    Войти
                                </Button>
                            </CenteredGrid>
                        </Grid>
                    </Grid>
                </Grid>
            </CenteredGrid>
        </SectionLayout>
    );
};
