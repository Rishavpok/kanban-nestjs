import { IsEmail, IsString } from "class-validator";

export class loginDto {
    @IsEmail({} , { message : "Email must be valid" } )
    email : string

    @IsString()
    password : string
}