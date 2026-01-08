import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { TasksModule } from './module/tasks/tasks.module';
import { JwtStrategy } from './module/auth/strategies/jwt.strategy';

@Module({
  imports: [AuthModule , TasksModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
