import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';

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
}
