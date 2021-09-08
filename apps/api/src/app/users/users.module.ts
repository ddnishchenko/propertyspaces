import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProjectsService } from '../projects/projects.service';

@Module({
  providers: [UsersService, ProjectsService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule { }
