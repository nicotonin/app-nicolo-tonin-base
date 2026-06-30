import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsUrl, Matches, MinLength } from "class-validator";

export class AddUserDTO {
    @IsString()
    @IsNotEmpty({ message: 'FirstName should not be empty or just spaces' })
    @Matches(/^[A-Za-zÀÈÉÌÒÙàèéìòù\s]+$/, { message: 'FirstName must only contain letters and spaces' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'LastName should not be empty or just spaces' })
    @Matches(/^[A-Za-zÀÈÉÌÒÙàèéìòù\s]+$/, { message: 'LastName must only contain letters and spaces' })
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    role:string;

    @IsStrongPassword({
        minLength: 8
    })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'ConfirmPassword should not be empty' })
    confirmPassword: string;
}