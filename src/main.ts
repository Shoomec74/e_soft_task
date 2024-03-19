import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

//-- Подключение глобального обработчика для перехвата необработанных исключений и отклоненных промисов --//
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  Logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //-- Получение сервиса конфигурации и настройка глобального префикса для всех маршрутов --//
  const configService = app.get(ConfigService);

  //-- Настройка глобального префикса для всех маршрутов --//
  app.setGlobalPrefix(configService.get('GLOBAL_PREFIX'));

  //-- Установка порта из конфигурации --//
  const PORT = configService.get('APP_PORT');

  //-- Настройка глобальных пайпов для валидации и санитизации входных данных --//
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //-- Игнорировать свойства объектов, не описанные в DTO --//
      forbidNonWhitelisted: true, //-- Запретить неизвестные свойства --//
      transform: true, //-- Преобразование входных данных к соответствующим DTO классам --//
      exceptionFactory: (errors) => new BadRequestException(errors), //-- Фабрика исключений для ошибок валидации --//
    }),
  );

  //-- Применение промежуточного ПО Helmet для увеличения безопасности приложения --//
  app.use(helmet());

  //-- Настройка CORS --//
  const cors = {
    origin: '*', //-- Разрешить запросы с любого источника --//
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', //-- Разрешенные HTTP-методы --//
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'], //-- Разрешенные заголовки --//
    credentials: true, //-- Поддержка учетных данных --//
  };
  app.enableCors(cors);

  //-- Настройка Swagger для автогенерации документации API --//
  const config = new DocumentBuilder()
    .setTitle('API ESOFT_TASK')
    .setDescription('Ручки для команды frontend')
    .setVersion('1.0')
    .addTag('auth', 'Авторизация пользователей')
    .addBearerAuth() //-- Настройка схемы авторизации --//
    .build(); //-- Завершаем конфигурирование вызовом build --//

  //-- Создание документа Swagger и его экспорт в формате YAML --//
  const document = SwaggerModule.createDocument(app, config);
  const yamlDocument = yaml.dump(document);
  fs.writeFileSync('./swagger.yaml', yamlDocument, 'utf8');

  //-- Настройка маршрута для доступа к документации через веб-интерфейс --//
  SwaggerModule.setup(
    `${configService.get('GLOBAL_PREFIX')}/docs`,
    app,
    document,
  );

  await app.listen(PORT);
}

bootstrap();
