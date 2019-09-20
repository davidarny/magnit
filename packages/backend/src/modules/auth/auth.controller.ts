import { Controller, Body, Post } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Controller("auth")
export class AuthController {
    @Post("/register")
    async register(@Body() user: User) {
        return;
    }

    @Post("/login")
    async login(@Body() user: User) {
        return;
    }
}
