import { IsString, IsOptional } from "class-validator";


export class Add{{Name}}DTO {
  @IsString()
  name: string;
}

export class Update{{Name}}DTO {
  @IsOptional()
  @IsString()
  name?: string;
}