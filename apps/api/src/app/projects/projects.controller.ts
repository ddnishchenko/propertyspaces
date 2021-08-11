import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) { }
  @Post()
  async create(@Body() project, @Res() res) {
    const result = await this.projectService.put(project);
    return res
      .status(201)
      .json(result);
  }

  @Get()
  async findAll(@Res() res) {
    const result = await this.projectService.list();
    return res.json(result.Items);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const result = await this.projectService.read(id);
    return res.json(result.Item);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body, @Res() res) {
    await this.projectService.update(id, body);
    return res.status(204).end();
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    await this.projectService.delete(id);
    return res.status(204).end();
  }

  @Post(':id/panorama')
  async createPanorama(@Param('id') id: string, @Body() body, @Res() res) {
    const result = await this.projectService.createPanorama(id, body);
    return res.status(201).json(result.Attributes);
  }

  @Put(':id/panorama/:key')
  async updatePanorama(@Param('id') id: string, @Param('key') key, @Body() body) {
    return true;
  }

  @Delete(':id/panorama/:key')
  async deletePanorama(@Param('id') id: string, @Param('key') key: string, @Res() res) {
    await this.projectService.deletePanorama(id, key);
    return res.status(204).end();
  }
}
