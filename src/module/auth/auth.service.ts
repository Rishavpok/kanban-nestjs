import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/AdminCreateUserDto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createUser: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: createUser.email },
    });

    if (existingUser) {
      throw new HttpException(
        'Email already registered',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordSame = createUser.password === createUser.confirmPassword;
    if (!isPasswordSame) {
      throw new HttpException(
        'Password and confirm password doesnot match',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const hashedPassword = await bcrypt.hash(createUser.password, 10);
      const data = {
        name: createUser.name,
        email: createUser.email,
        password: hashedPassword,
      };

      return await this.prisma.user.create({ data });
    } catch (e) {
      throw new HttpException(
        'Failed to register new user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(login: loginDto) {
    const { email, password } = login;
    const user = await this.prisma.user.findFirst({
      where: { email: email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // generate jwt token
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      message: 'Login successful',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }


  async createUserByAdmin(createUser : CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: createUser.email },
    });

    if (existingUser) {
      throw new HttpException(
        'Email already registered',
        HttpStatus.BAD_REQUEST,
      );
    }


    try {
      const hashedPassword = await bcrypt.hash(createUser.password, 10);
      const data = {
        name: createUser.name,
        email: createUser.email,
        password: hashedPassword,
        role : createUser.role,
        status: createUser.status
      };

      return await this.prisma.user.create({ data });
    } catch (e) {
      throw new HttpException(
        'Failed to register new user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
