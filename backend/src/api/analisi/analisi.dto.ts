import { IsString, IsOptional, IsNotEmpty } from "class-validator";

export class AddAnalisiDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;
}

export class UpdateAnalisiDTO {
  @IsOptional()
  @IsString()
  name?: string;
}