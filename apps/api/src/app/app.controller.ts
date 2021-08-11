import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { Message } from '@propertyspaces/api-interfaces';

import { AppService } from './app.service';

import { DynamoDB, S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';

@Controller()
export class AppController {
  constructor(private appService: AppService) { }
  @Get('') index() {
    return { appName: 'Lidarama' };
  }
  @Get('hello')
  getData(): any {
    return this.appService.getData();
  }
  @Post('project')
  async createProject(@Req() req: Request, @Res() res: Response) {
    let dynamoDBClient = new DynamoDB.DocumentClient();

    let params = {
      TableName: 'Projects',
      Item: {
        ID: randomUUID(),
        ...req.body
      }
    };
    await dynamoDBClient.put(params).promise();
    return res.json(req.body)
  }
  @Post('upload-file')
  async uploadFile(@Req() req: Request, @Res() res: Response) {
    let s3 = new S3();
    let file = Buffer.from(req.body.src.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    let type = req.body.src.split(';')[0].split('/')[1];
    let opts: S3.Types.PutObjectRequest
    let s3Object = await s3.upload({
      Bucket: 'lidarama1media',
      Key: `project-name/${req.body.filename}`,
      // ACL: 'public-read'
      Body: file,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    }).promise();

    return res.json(s3Object);
  }
}
