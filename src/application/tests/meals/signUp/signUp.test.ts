import { handler } from "@main/functions/auth/signUp";

describe("signUp handler", () => {
    it("must do a complete test", async () => {
        const event = {
            body: JSON.stringify({
                account: { email: "teste2@gmail.com", password: "1234d5678" },
                profile: { name: "John", birthDate: "2000-07-06", gender: "male", height: 180, weight: 70, activityLevel: "moderate", goal: "maintain_weight" }
            }),
            httpMethod: "POST",
            headers: {},
            requestContext: {
                authorizer: {
                    jwt: {
                        claims: { internalId: "1234567890" }
                    }
                }
            }
        };
        const result: any = await handler(event as any);
        expect(result.statusCode).toBe(201);
        expect(result.body).toBeDefined();
    });

});
