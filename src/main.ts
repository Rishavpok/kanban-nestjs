import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
     origin: '*', // Allow all origins (for testing)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // if you use cookies or authorization headers
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
