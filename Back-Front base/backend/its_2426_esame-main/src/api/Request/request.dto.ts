import { IsNotEmpty, IsString, IsDateString, IsOptional, IsUUID } from "class-validator";

export class CreateRequestDTO {
  @IsDateString()
  dataInizio: string;

  @IsDateString()
  dataFine: string;

  @IsString()
  @IsNotEmpty()
  categoriaId: string;

  @IsString()
  @IsNotEmpty()
  motivazione: string;
}

export class UpdateRequestDTO {
  @IsDateString()
  @IsOptional()
  dataInizio?: string;

  @IsDateString()
  @IsOptional()
  dataFine?: string;

  @IsString()
  @IsOptional()
  motivazione?: string;
}
