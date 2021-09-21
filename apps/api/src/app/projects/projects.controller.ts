import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, StreamableFile, UseGuards } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../roles/role.enum';
import { ProjectsService } from './projects.service';

const objToArr = (obj) => {
  const arr = obj ? Object.keys(obj).map(k => obj[k]) : [];
  return arr.length ? arr : [];
};

@Controller('projects')
export class ProjectsController {

  constructor(
    private projectService: ProjectsService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() body) {
    const result = await this.projectService.put({ userId: req.user.id, ...body, panoramas: {}, gallery: {}, createdAt: Date.now() });
    return { ...result, panoramas: [], gallery: [] };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req, @Query('user') user) {
    const userId = req.user.roles.includes(Role.Admin) ? user : req.user.id;
    const result = await this.projectService.list(userId);
    return result.Items;
  }

  @Get('file/:project/:key')
  async getFile(@Param('project') project, @Param('key') key, @Res() res) {
    // res.attachment(key);
    /* const filePath = join(__dirname, key);
    const tmpFile = fs.createWriteStream(filePath);
    // const readStream = this.projectService.getS3Object(project, key).createReadStream().pipe(tmpFile);
    // this.projectService.getS3Object(project, key).createReadStream().pipe(res);
    const f = await this.projectService.getS3Object(project, key).promise();
    tmpFile.write(f.Body);
    tmpFile.close();
    const file = fs.createReadStream(filePath);
    return new StreamableFile(file); */
    // tmpFile.pipe(res);
    // tmpFile.pipe(res);
    const u = this.projectService.getS3Object(project, key);
    console.log(u);
    // res.redirect(u);
    res.json({ u });




  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.projectService.read(id);
    let gallery = objToArr(result.Item.gallery);
    if (result.Item.gallerySort) {
      const unsorted = gallery.filter(o => !result.Item.gallerySort.includes(o.id));
      const sorted = result.Item.gallerySort.map(id => result.Item.gallery[id]);
      gallery = sorted.concat(unsorted);
    }
    return {
      ...result.Item,
      panoramas: objToArr(result.Item.panoramas),
      gallery
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() body) {
    const result = await this.projectService.update(id, body, req.user);
    return result.Attributes;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    await this.projectService.delete(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/panorama')
  async createPanorama(@Req() req, @Res() res, @Param('id') id: string, @Body() body) {
    const result = await this.projectService.createPanorama(id, body, req.user);
    return res.json(objToArr(result.Attributes.panoramas));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/panorama/:key')
  async getPanorama(@Param('id') id: string, @Param('key') key) {
    const result = await this.projectService.getPanorama(id, key);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/panorama/:key')
  async updatePanorama(@Req() req, @Param('id') id: string, @Param('key') key, @Body() body) {
    const result = await this.projectService.updatePanorama(id, key, body, req.user);
    return objToArr(result.Attributes.panoramas);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/panorama/:key')
  async deletePanorama(@Req() req, @Param('id') id: string, @Param('key') key: string, @Body() body) {
    await this.projectService.deletePanorama(id, key, body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/gallery')
  async createGalleryItem(@Req() req, @Param('id') id: string, @Body() body) {
    const result = await this.projectService.addGalleryItem(id, body, req.user);
    return objToArr(result.Attributes.gallery);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/gallery/:key')
  async updateGalleryItem(@Req() req, @Param('id') id: string, @Param('key') key: string, @Body() body) {
    const result = await this.projectService.updateGalleryItem(id, key, body, req.user);
    return objToArr(result.Attributes.gallery);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/gallery/:key')
  async deleteGalleryItem(@Req() req, @Param('id') id: string, @Param('key') key: string, @Body() body) {
    await this.projectService.deleteGalleryItem(id, key, body, req.user);
  }


}
