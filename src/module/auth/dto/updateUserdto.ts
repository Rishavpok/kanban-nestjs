import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './AdminCreateUserDto'; 

export class UpdateAdminUser extends PartialType(CreateUserDto) {}