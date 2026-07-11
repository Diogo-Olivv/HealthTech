import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim());

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const nodeEnv = (process.env.NODE_ENV ?? 'development').toLowerCase();
  const swaggerEnabled = ['development', 'dev', 'staging', 'test'].includes(
    nodeEnv,
  );

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('HealthTech API')
      .setDescription(
        'Documentação da API REST do HealthTech (pacientes, médicos, vínculos, arquivos e auditoria).',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          description: 'Insira o token JWT obtido no endpoint POST /users/login.',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`Backend listening on port ${port}`);
  if (swaggerEnabled) {
    console.log(`Swagger UI available at http://localhost:${port}/docs`);
  }
}
bootstrap();
