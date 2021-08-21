import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { ProjectsService } from './projects.service';

const objToArr = (obj) => {
  const arr = obj ? Object.keys(obj).map(k => obj[k]) : [];
  return arr.length ? arr : undefined;
};

@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) { }
  @Post()
  async create(@Body() project, @Res() res) {
    const result = await this.projectService.put({ ...project, panoramas: {}, createdAt: Date.now() });
    return res
      .status(201)
      .json(result);
  }

  @Get()
  async findAll(@Res() res) {
    const result = await this.projectService.list();
    return res.json(result.Items.map(item => {
      return {
        ...item,
        panoramas: objToArr(item.panoramas)
      }
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    const result = await this.projectService.read(id);
    return res.json({
      ...result.Item,
      panoramas: objToArr(result.Item.panoramas)
    });
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
    return res.status(201).json(objToArr(result.Attributes.panoramas));
  }

  @Put(':id/panorama/:key')
  async updatePanorama(@Param('id') id: string, @Param('key') key, @Body() body, @Res() res) {
    const result = await this.projectService.updatePanorama(id, key, body);
    return res.json(objToArr(result.Attributes.panoramas));
  }

  @Delete(':id/panorama/:key')
  async deletePanorama(@Param('id') id: string, @Param('key') key: string, @Body() body, @Res() res) {
    await this.projectService.deletePanorama(id, key, body);
    return res.status(204).end();
  }
}
