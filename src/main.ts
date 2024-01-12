import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  dotenv.config(); // Load environment variables from .env

  const app = await NestFactory.create(AppModule);

   // Create a Swagger document builder
   const config = new DocumentBuilder()
   .setTitle('Nest Js Project')
   .setDescription('Your API Description')
   .setVersion('1.0')
   .addTag('your-tag')
   .build();

 const document = SwaggerModule.createDocument(app, config);

 // Set up Swagger UI
 SwaggerModule.setup('api', app, document);

  app.listen(process.env.PORT, () => {
    console.log(`Nest server is running on ${process.env.PORT}`);
  })
}
bootstrap();
