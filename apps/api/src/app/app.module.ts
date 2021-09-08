import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    ProjectsModule,
    AuthModule,
    UsersModule,
    CaslModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    /* {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }, */
  ],
})
export class AppModule { }
