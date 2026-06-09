import { IsString, IsOptional,IsNotEmpty} from "class-validator";


export class Add{{Name}}DTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class Update{{Name}}DTO {
  @IsOptional()
  @IsString()
  name?: string;
}