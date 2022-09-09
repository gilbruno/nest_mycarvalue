import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session')

/**
 * Validation Pipe is set here in the bootstrap
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 'keys' property is used to encrypt the cookie
  app.use(
    cookieSession(
      {
        keys: ['drgxdh']
      }
    )
  )
  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true
      }
    )
  )
  await app.listen(3000);
}
bootstrap();
