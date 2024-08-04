import { HttpStatus } from "@nestjs/common";
import { User } from "../user.entity";

export interface UserResponse {
    message: string;
    user?: User;
    statusCode: HttpStatus
}

