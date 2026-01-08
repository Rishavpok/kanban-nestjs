import { IsEmail, IsString } from 'class-validator';
import { Match } from '../../../common/decorators/match.decorators';


export class RegisterDto {

  @IsString()
  name: string;

  @IsEmail( {} , { message : 'Email must be a valid email address' } )
  email: string;

  @IsString()
  password: string;

  @Match( 'password' , { message: 'Passwords do not match' })
  confirmPassword : string;



}