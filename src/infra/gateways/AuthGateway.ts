import { Injectable } from "@kernel/decorators/Injectable";
import { cognitoClient } from "../clients/cognitoClient";
import { AdminDeleteUserCommand, ConfirmForgotPasswordCommand, ForgotPasswordCommand, GetTokensFromRefreshTokenCommand, InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { AppConfig } from "@shared/config/appconfig";
import { createHmac } from "node:crypto";

@Injectable()
export class AuthGateway {
    constructor(private readonly appConfig: AppConfig) { }

    async signUp({ email, password, internalId }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
        const command = new SignUpCommand({
            ClientId: this.appConfig.auth.cognito.client.id,
            Username: email, Password: password,
            SecretHash: this.getSecretHash(email),
            UserAttributes: [
                {
                    Name: "custom:internalId",
                    Value: internalId,
                },
            ],
        });

        const { UserSub: externalId } = await cognitoClient.send(command);

        if (!externalId) {
            throw new Error(`cannot signup user ${email}`);
        }

        return {
            externalId,
        };
    }

    async signIn({ email, password }: AuthGateway.SignInParams): Promise<AuthGateway.SignInResult> {
        const command = new InitiateAuthCommand({
            ClientId: this.appConfig.auth.cognito.client.id,
            AuthFlow: "USER_PASSWORD_AUTH",
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: this.getSecretHash(email),
            },
        });

        const { AuthenticationResult } = await cognitoClient.send(command);

        if (!AuthenticationResult?.AccessToken || !AuthenticationResult?.RefreshToken) {
            throw new Error(`cannot signin user ${email}`);
        }

        return { accessToken: AuthenticationResult.AccessToken, refreshToken: AuthenticationResult.RefreshToken };
    }

    private getSecretHash(email: string): string {
        const { id, secret } = this.appConfig.auth.cognito.client;

        return createHmac("SHA256", secret).update(`${email}${id}`).digest("base64");
    }

    async refreshToken({ refreshToken }: AuthGateway.RefreshTokenParams): Promise<AuthGateway.RefreshTokenResult> {
        const command = new GetTokensFromRefreshTokenCommand({
            ClientId: this.appConfig.auth.cognito.client.id,
            RefreshToken: refreshToken,
            ClientSecret: this.appConfig.auth.cognito.client.secret,
        });

        const { AuthenticationResult } = await cognitoClient.send(command);

        if (!AuthenticationResult?.AccessToken || !AuthenticationResult?.RefreshToken) {
            throw new Error(`cannot refresh token`);
        }

        return { accessToken: AuthenticationResult.AccessToken, refreshToken: AuthenticationResult.RefreshToken };
    }
    async forgotPassword({ email }: AuthGateway.ForgotPasswordParams): Promise<AuthGateway.ForgotPasswordResult> {
        const command = new ForgotPasswordCommand({
            ClientId: this.appConfig.auth.cognito.client.id,
            Username: email,
            SecretHash: this.getSecretHash(email),
        });

        await cognitoClient.send(command);
    }

    async confirmForgotPassword({ email, code, newPassword }: AuthGateway.ConfirmForgotPasswordParams): Promise<AuthGateway.ConfirmForgotPasswordResult> {
        const command = new ConfirmForgotPasswordCommand({
            ClientId: this.appConfig.auth.cognito.client.id,
            Username: email,
            ConfirmationCode: code,
            Password: newPassword,
            SecretHash: this.getSecretHash(email),
        });

        await cognitoClient.send(command);
    }

    async deleteUser({ externalId }: AuthGateway.DeleteUserParams): Promise<AuthGateway.DeleteUserResult> {
        const command = new AdminDeleteUserCommand({
            UserPoolId: this.appConfig.auth.cognito.pool.id,
            Username: externalId,
        });

        await cognitoClient.send(command);
    }
}

export namespace AuthGateway {
    export type SignUpParams = {
        email: string;
        password: string;
        internalId: string;
    };

    export type SignUpResult = {
        externalId: string;
    };

    export type SignInParams = {
        email: string;
        password: string;
    };

    export type SignInResult = {
        accessToken: string;
        refreshToken: string;
    };
    export type RefreshTokenParams = {
        refreshToken: string;
    };
    export type RefreshTokenResult = {
        accessToken: string;
        refreshToken: string;
    };
    export type ForgotPasswordParams = {
        email: string;
    };
    export type ForgotPasswordResult = void;
    export type ConfirmForgotPasswordParams = {
        email: string;
        code: string;
        newPassword: string;
    };
    export type ConfirmForgotPasswordResult = void;

    export type DeleteUserParams = {
        externalId: string;
    };
    export type DeleteUserResult = void;
}
