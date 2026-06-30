import { IsString, IsNotEmpty } from "class-validator";

export class AddCategoryDTO {
    @IsString()
    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Description should not be empty' })
    description: string;
}
