import { HttpStatus } from "@nestjs/common";
import { Customer } from "../customer.entity";

export interface CustomerResponse {
    message: string;
    customer?: Customer;
    statusCode: HttpStatus
}


