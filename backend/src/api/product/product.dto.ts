import { IsString, IsOptional } from "class-validator";


export class AddProductDTO {
  @IsString()
  name: string;
}

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  name?: string;
}