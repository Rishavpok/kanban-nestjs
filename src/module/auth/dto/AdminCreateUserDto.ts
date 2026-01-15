import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role, Status } from '@prisma/client';


export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsEnum(Status)
  status: Status;
}
