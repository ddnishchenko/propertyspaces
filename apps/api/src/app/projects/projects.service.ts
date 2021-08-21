import { Injectable } from '@nestjs/common';

import { DynamoDB, S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';

const db = new DynamoDB.DocumentClient({});
const s3 = new S3({})

@Injectable()
export class ProjectsService {
  read(id) {
    return db.get({
      TableName: 'projects',
      Key: { id }
    }).promise();
  }
  list() {
    return db.scan({ TableName: 'projects', ExpressionAttributeNames: { '#name': 'name' }, ProjectionExpression: 'id,#name,addr' }).promise();
  }
  put(data, id?) {
    const Item = { id: id ? id : randomUUID(), ...data };
    return db.put({ TableName: 'projects', Item }).promise().then(() => Item);
  }
  update(id, body) {
    const ExpressionAttributeValues = {};
    const keys = Object.keys({ ...body, updatedAt: Date.now() }).filter(k => k !== 'id');
    keys.forEach(k => {
      ExpressionAttributeValues[`:${k}`] = body[k];
    });
    const UpdateExpression = `set ` + keys.map(k => `${k} = :${k}`).join(', ');
    return db.update({
      TableName: 'projects',
      Key: { id },
      UpdateExpression,
      ExpressionAttributeValues,
      ReturnValues: 'UPDATED_NEW'
    }).promise();
  }
  delete(id: string) {
    return db.delete({
      TableName: 'projects',
      Key: { id }
    }).promise().then((r) => {
      s3.listObjects({
        Bucket: 'lidarama1media',
        Prefix: id + '/'
      }).promise().then(data => {

        s3.deleteObjects({
          Bucket: 'lidarama1media',
          Delete: {
            Objects: data.Contents.map(({ Key }) => ({ Key }))
          }
        }).promise();
      });
      return r;
    });
  }
  async createPanorama(projectId, data) {
    const file = Buffer.from(data.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const fileType = data.url.split(';')[0].split('/')[1];

    const panoId = randomUUID();
    const panoName = `${panoId}.${fileType}`;
    const s3Object = await s3.upload({
      Bucket: 'lidarama1media',
      Key: `${projectId}/${panoName}`,
      Body: file,
      ContentEncoding: 'base64',
      ACL: 'public-read',
      ContentType: `image/${fileType}`
    }).promise();

    const panorama = {
      ...data,
      id: panoId,
      fileName: panoName,
      url: s3Object.Location,
      createdAt: Date.now()
    };

    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      // UpdateExpression: 'set #panoramas = list_append(if_not_exists(#panoramas, :empty_list), :panorama)',
      UpdateExpression: `set #panoramas.#id = :panorama`,
      ExpressionAttributeNames: {
        '#panoramas': 'panoramas',
        '#id': panorama.id
      },
      ExpressionAttributeValues: {
        ':panorama': panorama
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise();


  }

  async updatePanorama(projectId, key, data) {

    let panorama = { ...data, updatedAt: Date.now() };

    if (data.url.includes('base64')) {
      const file = Buffer.from(data.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const fileType = data.url.split(';')[0].split('/')[1];

      const panoName = `${key}.${fileType}`;

      const s3Object = await s3.upload({
        Bucket: 'lidarama1media',
        Key: `${projectId}/${panoName}`,
        Body: file,
        ContentEncoding: 'base64',
        ContentType: `image/${fileType}`
      }).promise();

      panorama.url = s3Object.Location;

    }

    if (data.dark_pano?.url.includes('base64')) {
      const file = Buffer.from(data.dark_pano.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const fileType = data.dark_pano.url.split(';')[0].split('/')[1];

      const panoFileName = `${key}_dark`
      const panoName = `${panoFileName}.${fileType}`;

      const s3Object = await s3.upload({
        Bucket: 'lidarama1media',
        Key: `${projectId}/${panoName}`,
        Body: file,
        ContentEncoding: 'base64',
        ContentType: `image/${fileType}`
      }).promise();

      panorama.dark_pano = {
        ...panorama.dark_pano,
        url: s3Object.Location,
        id: panoFileName,
        fileName: panoName,
        updatedAt: Date.now()
      };
    }
    if (data.light_pano?.url.includes('base64')) {
      const file = Buffer.from(data.light_pano.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const fileType = data.light_pano.url.split(';')[0].split('/')[1];

      const panoFileName = `${key}_light`
      const panoName = `${panoFileName}.${fileType}`;

      const s3Object = await s3.upload({
        Bucket: 'lidarama1media',
        Key: `${projectId}/${panoName}`,
        Body: file,
        ContentEncoding: 'base64',
        ContentType: `image/${fileType}`
      }).promise();

      panorama.light_pano = {
        ...panorama.dark_light,
        url: s3Object.Location,
        id: panoFileName,
        fileName: panoName,
        updatedAt: Date.now()
      };
    }
    // if (data.hdr_pano.url.includes('base64')) {}

    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      // UpdateExpression: 'set #panoramas = list_append(if_not_exists(#panoramas, :empty_list), :panorama)',
      UpdateExpression: `set #panoramas.#id = :panorama`,
      ExpressionAttributeNames: {
        '#panoramas': 'panoramas',
        '#id': key
      },
      ExpressionAttributeValues: {
        ':panorama': panorama
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise();

  }

  deletePanorama(projectId, panoId, panorama) {

    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      UpdateExpression: 'remove #panoramas.#key',
      ExpressionAttributeNames: {
        '#panoramas': 'panoramas',
        '#key': panoId
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise().then(() => {
      s3.deleteObject({
        Bucket: 'lidarama1media',
        Key: panorama.fileName
      }).promise();
    });
  }
}
