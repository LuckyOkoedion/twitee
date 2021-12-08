import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as cors from "cors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const options = {
    "origin": true,
    "methods": "GET,HEAD,PUT,PATCH,POST, OPTIONS,DELETE",
    // "preflightContinue": false,
    // "optionsSuccessStatus": 200,
    "credentials": true,
    "allowedHeaders": "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
  }

  app.use(cors(options));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('The Twitee API')
    .setDescription('Demo Api built with node.js, typescript, sequelize ORM, Passport-jwt and postgresql')
    .setVersion('1.0')
    .addTag('By Lucky Okoedion')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('documentation', app, document);


  await app.listen(3000);
}
bootstrap();
