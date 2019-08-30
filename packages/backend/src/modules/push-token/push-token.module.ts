import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PushToken } from "./entities/push-token.entity";
import { PushTokenController } from "./push-token.controller";
import { PushTokenService } from "./services/push-token.service";

@Module({
    imports: [TypeOrmModule.forFeature([PushToken])],
    controllers: [PushTokenController],
    providers: [PushTokenService],
})
export class PushTokenModule {}
