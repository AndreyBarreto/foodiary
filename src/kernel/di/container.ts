import { HelloController } from "@application/controllers/SingUpController";
import { HelloUseCase } from "@application/usecases/auth/SignUpUseCase";
import { Registry } from "./Registry";

export const container = Registry.getInstance()

// container.register(HelloController)
// container.register(HelloUseCase)

