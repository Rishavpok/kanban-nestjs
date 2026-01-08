import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports :[
    PrismaModule,
    JwtModule.register({
      secret : process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    })
  ]
})
export class TasksModule {}
