import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/auth.guards';
import { RolesGuard } from './guards/role.guards';
import { Role } from '@prisma/client';
import { Roles } from './decorators/roles.decorators';
import { CreateUserDto } from './dto/AdminCreateUserDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async createUser(@Body() createUser: RegisterDto) {
    return this.authService.register(createUser);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: loginDto) {
    return this.authService.login(loginDto);
  }

  @Post('admin/create-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async createUserByAdmin(@Body() createUser: CreateUserDto) {
    return this.authService.createUserByAdmin(createUser);
  }

}
