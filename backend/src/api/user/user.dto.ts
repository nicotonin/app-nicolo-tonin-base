import { IsIn, IsString } from "class-validator";

export class QueryListUserDTO {
    @IsString()
    @IsIn(['dipendente', 'responsabile'])
    role: string;
} 