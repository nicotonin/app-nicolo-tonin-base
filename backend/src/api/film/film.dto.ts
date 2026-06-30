import { IsString, IsNotEmpty, IsNumber, Min, Max, IsMongoId } from "class-validator";

export class AddFilmDTO {
    @IsString()
    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Description should not be empty' })
    description: string;

    @IsNumber()
    @Min(0, { message: 'Rating must be at least 0' })
    @Max(10, { message: 'Rating must be at most 10' })
    rating: number;

    @IsString()
    @IsNotEmpty({ message: 'Release date should not be empty' })
    releaseDate: string;

    @IsString()
    @IsNotEmpty({ message: 'Category is required' })
    @IsMongoId({ message: 'Category must be a valid ID' })
    categoryID: string;
}
