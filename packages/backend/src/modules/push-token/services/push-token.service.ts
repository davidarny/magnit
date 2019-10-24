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
        await this.deletePrevRecords(token);
        return this.save(token);
    }

    @Transactional()
    async deletePrevRecords(pushToken: PushToken): Promise<void> {
        const tokens = await this.pushTokenRepository.find({
            where: { token: pushToken.token },
        });
        if (tokens.some(foundToken => foundToken.id_user !== pushToken.id_user)) {
            await this.pushTokenRepository.remove(tokens);
        }
    }

    @Transactional()
    async findByUserId(userId: string): Promise<PushToken[]> {
        return this.pushTokenRepository.find({ where: { id_user: userId } });
    }

    @Transactional()
    async save(token: PushToken): Promise<PushToken> {
        return this.pushTokenRepository.save(token);
    }
}
