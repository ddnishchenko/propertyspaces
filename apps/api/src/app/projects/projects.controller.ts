import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, Res, StreamableFile, UseGuards } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../roles/role.enum';
import { ProjectsService } from './projects.service';

import * as archiver from 'archiver';

const archive = archiver('zip');

const objToArr = (obj) => {
  const arr = obj ? Object.keys(obj).map(k => obj[k]) : [];
  return arr.length ? arr : [];
};

function getFilename(url, prefix = '') {
  if (!url) return url;
  const urlParts = url.split('/');
  return prefix + urlParts[urlParts.length - 1];
}

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
    // const tmpFile = fs.createWriteStream(filePath);
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
  @Get(':id/build')
  async buildTour(@Param('id') id, @Req() req, @Res() res) {
    const project = await this.projectService.read(id);

    const appPath = join(__dirname, 'assets/lidarama-app')
    const tmpPath = join(appPath, 'assets');
    fs.mkdirSync(tmpPath, { recursive: true });
    const tmpPanoramaPath = join(tmpPath, 'panoramas');
    fs.mkdirSync(tmpPanoramaPath, { recursive: true });
    const tmpGalleryPath = join(tmpPath, 'gallery');
    fs.mkdirSync(tmpGalleryPath, { recursive: true });
    const data = {
      ...project.Item,
      panoramas: objToArr(project.Item.panoramas).map(p => {
        return {
          ...p,
          url: getFilename(p.url, 'assets/panoramas/'),
          dark_pano: {
            url: getFilename(p?.dark_pano?.url, 'assets/panoramas/')
          },
          light_pano: {
            url: getFilename(p?.light_pano?.url, 'assets/panoramas/')
          }
        };
      }),
      gallery: objToArr(project.Item.gallery).map(p => {
        return {
          ...p,
          url: getFilename(p.url, 'assets/gallery/'),
        };
      })
    };

    const panoUrls = data.panoramas
      .reduce(
        (prev, next) => prev.concat(next.url, next.dark_pano.url, next.light_pano.url),
        []
      ).filter(u => !!u);

    const galleryUrls = data.gallery.map(g => g.url);

    for (let val of panoUrls) {
      const fileName = getFilename(val);
      const key = `${id}/${fileName}`;
      const obj = await this.projectService.getObject(key).promise();
      const buf: any = obj.Body;
      fs.writeFileSync(join(tmpPanoramaPath, fileName), buf);
    }

    for (let val of galleryUrls) {
      const fileName = getFilename(val);
      const key = `${id}/${fileName}`;
      const obj = await this.projectService.getObject(key).promise();
      const buf: any = obj.Body;
      fs.writeFileSync(join(tmpGalleryPath, fileName), buf);
    }

    fs.writeFileSync(tmpPath + '/data.json', JSON.stringify(data));


    const zipPath = appPath + '.zip';
    const output = fs.createWriteStream(zipPath);

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', async () => {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      const zipBuild = fs.createReadStream(zipPath);
      const s3Obj = await this.projectService.uploadObject({
        Key: `${id}/build.zip`,
        Body: zipBuild
      }).promise();
      const build = { url: s3Obj.Location, builtAt: Date.now() };
      this.projectService.update(id, { build }, req.user);
      fs.rmdirSync(tmpPanoramaPath, { recursive: true });
      fs.rmdirSync(tmpGalleryPath, { recursive: true });
      fs.unlinkSync(tmpPath + '/data.json');
      fs.unlinkSync(zipPath);
      res.json({ build });
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function () {
      console.log('Data has been drained');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        throw err;
      }
    });

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
      throw err;
    });

    // pipe archive data to the file
    archive.pipe(output);

    archive.directory(appPath, false);

    archive.finalize();



    // const files = await this.projectService.getListObjects(id).promise();
    // res.json(files);
    // fs.rmdirSync(tmpPath, { recursive: true });
    // const arch = join(tmpPath);
    // const tmpFile = fs.createWriteStream(filePath);
    // const readStream = this.projectService.getS3Object(project, key).createReadStream().pipe(tmpFile);
    // this.projectService.getS3Object(project, key).createReadStream().pipe(res);
    // const f = await this.projectService.getS3Object(project, key).promise();
    // tmpFile.write(f.Body);
    // tmpFile.close();
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
