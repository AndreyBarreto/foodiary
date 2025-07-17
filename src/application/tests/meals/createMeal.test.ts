import { handler } from "@main/functions/meals/createMeal";

describe("createMeal handler", () => {
    it("must do a complete test", async () => {
        const event = {
            body: JSON.stringify({
                name: "teste",
                password: "teste",
            }),
            httpMethod: "POST",
            headers: {},
        };
        const result = await handler(event as any);
        console.log(result);

        // expect(result.statusCode).toBe(400);
        // outros expects conforme o erro retornado
    });

});
