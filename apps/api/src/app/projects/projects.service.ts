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
    return db.scan({ TableName: 'projects' }).promise();
  }
  put(data, id?) {
    const Item = { id: id ? id : randomUUID(), ...data };
    return db.put({ TableName: 'projects', Item }).promise().then(() => Item);
  }
  update(id, body) {
    const ExpressionAttributeValues = {};
    const keys = Object.keys(body).filter(k => k !== 'id');
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

    const panoId = `${randomUUID()}.${fileType}`;
    const s3Object = await s3.upload({
      Bucket: 'lidarama1media',
      Key: `${projectId}/${panoId}`,
      Body: file,
      ContentEncoding: 'base64',
      ACL: 'public-read',
      ContentType: `image/${fileType}`
    }).promise();

    const panorama = {
      ...data,
      id: panoId,
      url: s3Object.Location
    };

    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      UpdateExpression: 'set #panoramas = list_append(if_not_exists(#panoramas, :empty_list), :panorama)',
      ExpressionAttributeNames: {
        '#panoramas': 'panoramas'
      },
      ExpressionAttributeValues: {
        ':panorama': [panorama],
        ':empty_list': []
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise();


  }

  async updatePanorama(projectId, key, data) {
    if (data.url.includes('base64')) {
      const file = Buffer.from(data.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const fileType = data.url.split(';')[0].split('/')[1];

      const s3Object = await s3.upload({
        Bucket: 'lidarama1media',
        Key: `${projectId}/${key}`,
        Body: file,
        ContentEncoding: 'base64',
        ContentType: `image/${fileType}`
      }).promise();

    }

    const project = await db.get({
      TableName: 'projects',
      Key: { id: projectId },
      ProjectionExpression: 'panoramas'
    }).promise();

    const panoramas = project.Item.panoramas.map(p => p.id === key ? { ...p, ...data } : p);

    return this.update(projectId, { panoramas });

  }

  deletePanorama(projectId, panorama) {


    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      UpdateExpression: 'set #panoramas = list_append(if_not_exists(#panoramas, :empty_list), :panorama)',
      ExpressionAttributeNames: {
        '#panoramas': 'panoramas'
      },
      ExpressionAttributeValues: {
        ':k': panorama.name,
      },
      ConditionExpression: 'contains()',
      ReturnValues: 'UPDATED_NEW'
    }).promise().then(() => {
      s3.deleteObject({
        Bucket: 'lidarama1media',
        Key: panorama.name
      }).promise();
    });
  }
}
