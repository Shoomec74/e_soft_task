import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

//-- Подключение глобального обработчика для перехвата необработанных исключений и отклоненных промисов --//
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  Logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
