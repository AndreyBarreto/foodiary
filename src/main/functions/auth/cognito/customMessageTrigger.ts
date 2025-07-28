import { CustomMessageTriggerEvent } from "aws-lambda";

export async function handler(event: CustomMessageTriggerEvent) {
    if (event.triggerSource === "CustomMessage_ForgotPassword") {
        const code = event.request.codeParameter;
        event.response.emailSubject = "Reset your password";
        event.response.emailMessage = `
            <p>Hello,</p>
            <p>You have requested to reset your password. Please use the following code to reset your password:</p>
            <p>${code}</p>
        `;
    }

    return event;
}
