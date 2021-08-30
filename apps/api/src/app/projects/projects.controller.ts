import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Res } from '@nestjs/common';
import { ProjectsService } from './projects.service';

const objToArr = (obj) => {
  const arr = obj ? Object.keys(obj).map(k => obj[k]) : [];
  return arr.length ? arr : [];
};

@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) { }
  @Post()
  async create(@Body() project, @Res() res) {
    const result = await this.projectService.put({ ...project, panoramas: {}, gallery: {}, createdAt: Date.now() });
    return res
      .status(201)
      .json({ ...result, panoramas: [], gallery: [] });
  }

  @Get()
  async findAll(@Res() res) {
    const result = await this.projectService.list();
    return res.json(result.Items.map(item => {
      let gallery = objToArr(item.gallery);
      if (item.gallerySort) {
        const unsorted = gallery.filter(o => !item.gallerySort.includes(o.id));
        const sorted = item.gallerySort.map(id => item.gallery[id]);
        gallery = sorted.concat(unsorted);
      }
      return {
        ...item,
        panoramas: objToArr(item.panoramas),
        gallery
      }
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
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

  @Put(':id')
  async update(@Param('id') id: string, @Body() body, @Res() res) {
    const result = await this.projectService.update(id, body);
    return res.json(result.Attributes);
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

  @Post(':id/gallery')
  async createGalleryItem(@Param('id') id: string, @Body() body, @Res() res) {
    const result = await this.projectService.addGalleryItem(id, body);
    return res.status(201).json(objToArr(result.Attributes.gallery));
  }

  @Put(':id/gallery/:key')
  async updateGalleryItem(@Param('id') id: string, @Param('key') key: string, @Body() body, @Res() res) {
    const result = await this.projectService.updateGalleryItem(id, key, body);
    return res.json(objToArr(result.Attributes.gallery));
  }

  @Delete(':id/gallery/:key')
  async deleteGalleryItem(@Param('id') id: string, @Param('key') key: string, @Body() body, @Res() res) {
    await this.projectService.deleteGalleryItem(id, key, body);
    return res.status(204).end();
  }
}
