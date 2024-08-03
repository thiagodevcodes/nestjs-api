import { HttpStatus } from "@nestjs/common";
import { User } from "../user.entity";

export interface CreatedUserResponse {
    message: string;
    user: User;
    statusCode: HttpStatus
}