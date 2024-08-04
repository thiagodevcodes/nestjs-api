import { HttpStatus } from "@nestjs/common";
import { Person } from "../person.entity";

export interface PersonResponse {
    message: string;
    person?: Person;
    statusCode: HttpStatus
}
