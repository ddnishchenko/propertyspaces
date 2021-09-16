import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ServerlessNestjsApplicationFactory } from 'serverless-lambda-nestjs';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { AppModule } from './app/app.module';
import { json, urlencoded } from 'body-parser';
import { AllExceptionsFilter } from './app/exception.filter';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: '*',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  });
  app.use(json({ limit: '30mb' }));
  app.use(urlencoded({ limit: '30mb', extended: true }));
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

// Run Nestjs application locally
if (process.env.NX_CLI_SET) {
  bootstrap();
}

// Run Nestjs application in AWS Lambda
export const handler: APIGatewayProxyHandler = async (event, context) => {
  const application = new ServerlessNestjsApplicationFactory<AppModule>(
    AppModule,
    {
      // NestFactory.create's option object
      cors: {
        origin: '*',
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
      },
    },
    app => {
      const { httpAdapter } = app.get(HttpAdapterHost);
      app.use(helmet());
      app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
      app.useGlobalPipes(new ValidationPipe());
      app.use(json({ limit: '30mb' }));
      app.use(urlencoded({ limit: '30mb', extended: true }));
      return app;
    }
  );
  const result = await application.run(event, context);
  return result;
};
