import { ProfileRepository } from "@infra/database/dynamo/repositories/ProfileRepository";
import { Injectable } from "@kernel/decorators/Injectable";
import { Profile } from "@application/entities/Profile";
import { ResourceNotFound } from "@application/errors/application/ResourceNotFound";

@Injectable()
export class UpdateProfileUseCase {
    constructor(private readonly profileRepository: ProfileRepository) { }

    async execute({ accountId, name, birthDate, gender, height, weight }: UpdateProfileUseCase.Input): Promise<UpdateProfileUseCase.Output> {
        const existingProfile = await this.profileRepository.findByAccountId(accountId);
        if (!existingProfile) {
            throw new ResourceNotFound("Profile not found");
        }

        existingProfile.name = name;
        existingProfile.birthDate = birthDate;
        existingProfile.gender = gender;
        existingProfile.height = height;
        existingProfile.weight = weight;

        await this.profileRepository.save(existingProfile);
    }
}

export namespace UpdateProfileUseCase {
    export type Input = {
        accountId: string
        name: string
        birthDate: Date
        gender: Profile.Gender
        height: number
        weight: number
    }
    export type Output = void
}
