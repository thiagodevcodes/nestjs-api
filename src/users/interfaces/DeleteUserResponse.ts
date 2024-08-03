import { HttpStatus } from "@nestjs/common";
import { User } from "../user.entity";

export interface DeleteUserResponse {
    message: string;
    statusCode: HttpStatus
}