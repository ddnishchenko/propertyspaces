import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';

const objToArr = (obj) => {
  const arr = obj ? Object.keys(obj).map(k => obj[k]) : [];
  return arr.length ? arr : [];
};

@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) { }
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Res() res, @Body() project) {
    const result = await this.projectService.put({ userId: req.user.id, ...project, panoramas: {}, gallery: {}, createdAt: Date.now() });
    return res
      .json({ ...result, panoramas: [], gallery: [] });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req, @Res() res) {
    const result = await this.projectService.list(req.user.id);
    return res.json(result.Items);
  }

  @Get(':id')
  async findOne(@Req() req, @Res() res, @Param('id') id: string) {
    const result = await this.projectService.read(id);
    let gallery = objToArr(result.Item.gallery);
    if (result.Item.gallerySort) {
      const unsorted = gallery.filter(o => !result.Item.gallerySort.includes(o.id));
      const sorted = result.Item.gallerySort.map(id => result.Item.gallery[id]);
      gallery = sorted.concat(unsorted);
    }
    return res.json({
      ...result.Item,
      panoramas: objToArr(result.Item.panoramas),
      gallery
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Req() req, @Res() res, @Param('id') id: string, @Body() body) {
    const result = await this.projectService.update(id, body, req.user.id);
    return res.json(result.Attributes);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Res() res, @Param('id') id: string) {
    await this.projectService.delete(id, req.user.id);
    return res.status(204).end();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/panorama')
  async createPanorama(@Req() req, @Res() res, @Param('id') id: string, @Body() body) {
    const result = await this.projectService.createPanorama(id, body);
    return res.status(201).json(objToArr(result.Attributes.panoramas));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/panorama/:key')
  async getPanorama(@Param('id') id: string, @Param('key') key, @Res() res) {
    const result = await this.projectService.getPanorama(id, key);
    return res.json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/panorama/:key')
  async updatePanorama(@Param('id') id: string, @Param('key') key, @Body() body, @Res() res) {
    const result = await this.projectService.updatePanorama(id, key, body);
    return res.json(objToArr(result.Attributes.panoramas));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/panorama/:key')
  async deletePanorama(@Res() res, @Req() req, @Param('id') id: string, @Param('key') key: string, @Body() body) {
    await this.projectService.deletePanorama(id, key, body, req.user.id);
    return res.status(204).end();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/gallery')
  async createGalleryItem(@Param('id') id: string, @Body() body, @Res() res) {
    const result = await this.projectService.addGalleryItem(id, body);
    return res.status(201).json(objToArr(result.Attributes.gallery));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/gallery/:key')
  async updateGalleryItem(@Param('id') id: string, @Param('key') key: string, @Body() body, @Res() res) {
    const result = await this.projectService.updateGalleryItem(id, key, body);
    return res.json(objToArr(result.Attributes.gallery));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/gallery/:key')
  async deleteGalleryItem(@Param('id') id: string, @Param('key') key: string, @Body() body, @Res() res) {
    await this.projectService.deleteGalleryItem(id, key, body);
    return res.status(204).end();
  }
}
