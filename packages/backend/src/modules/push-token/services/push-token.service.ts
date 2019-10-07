import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { PushToken } from "../entities/push-token.entity";

export class PushTokenService {
    constructor(
        @InjectRepository(PushToken) private readonly pushTokenRepository: Repository<PushToken>,
    ) {}

    @Transactional()
    async createUniqueToken(token: PushToken): Promise<PushToken> {
        await this.deletePreviousRecordsForToken(token);
        return this.save(token);
    }

    @Transactional()
    async deletePreviousRecordsForToken(tokenToInsert: PushToken): Promise<void> {
        const tokens = await this.pushTokenRepository.find({
            where: { token: tokenToInsert.token },
        });
        if (tokens.some(foundToken => foundToken.id_user !== tokenToInsert.id_user)) {
            await this.pushTokenRepository.remove(tokens);
        }
    }

    async getTokensByUserId(id: number): Promise<PushToken[]> {
        return this.pushTokenRepository.find({ where: { id_user: id } });
    }

    async save(token: PushToken): Promise<PushToken> {
        return this.pushTokenRepository.save(token);
    }
}
