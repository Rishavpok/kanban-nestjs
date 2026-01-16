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
import { UpdateAdminUser } from './dto/updateUserdto';

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
      role: user.role,
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

  async createUserByAdmin(createUser: CreateUserDto) {
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
        role: createUser.role,
        status: createUser.status,
      };

      return await this.prisma.user.create({ data });
    } catch (e) {
      throw new HttpException(
        'Failed to register new user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserList() {
    try {
      const users = await this.prisma.user.findMany({
        where: { role: 'USER' },
      });

      return {
        data: users,
      };
    } catch (e) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(userId: any, user: UpdateAdminUser) {
    const exisitingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!exisitingUser) {
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: user, // this should match the fields in UpdateAdminUser DTO
      });

      return {
        message: 'User data updated successfully',
        user: updatedUser,
      };
    } catch (e) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(userId: any) {
    const exisitingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    console.log(exisitingUser);
    if (!exisitingUser) {
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      // Delete related tasks first
      await this.prisma.task.deleteMany({
        where: { userId },
      });

      await this.prisma.user.delete({
        where: { id: userId },
      });

      return {
        message: 'User deleted Successfully',
      };
    } catch (e) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDashboardStats() {
    try {
      const totalUsers = await this.prisma.user.count({
        where: { role: 'USER' },
      });

      const activeUsers = await this.prisma.user.count({
        where: {
          role: 'USER',
          status: 'ACTIVE',
        },
      });

      const completedTasks = await this.prisma.task.count({
        where: { status: 'completed' },
      });

      const pendingTasks = await this.prisma.task.count({
        where: {
          OR: [{ status: 'inprogress' }, { status: 'todo' }],
        },
      });

      const recentTasks = await this.prisma.task.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
        },
        tasks: {
          completed: completedTasks,
          pending: pendingTasks,
          recent: recentTasks,
        },
      };
    } catch (e) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
