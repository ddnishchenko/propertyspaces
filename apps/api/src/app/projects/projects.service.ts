import { Injectable, Res } from '@nestjs/common';

import { DynamoDB, S3, Lambda } from 'aws-sdk';
import { randomUUID } from 'crypto';

const db = new DynamoDB.DocumentClient({});
const s3 = new S3({});
const lambda = new Lambda({});

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
  async update(id, body) {
    const ExpressionAttributeValues = {};
    const data = { ...body, updatedAt: Date.now() };
    const keys = Object.keys(data).filter(k => k !== 'id');

    for (let k of keys) {
      switch (k) {
        case 'floors':
          for (let i = 0; i < data[k].length; i++) {
            if (data[k][i].svg) {
              const file = Buffer.from(data[k][i].svg, 'utf-8');

              const panoName = `${data[k][i].floor}.svg`;
              console.log(panoName);
              const s3Object = await s3.upload({
                Bucket: 'lidarama1media',
                Key: `${id}/${panoName}`,
                Body: file,
                ACL: 'public-read',
                ContentType: 'image/svg+xml'
              }).promise();
              console.log(s3Object.Location);
              data[k][i].url = s3Object.Location;
              data[k][i].key = s3Object.Key;
              data[k][i].svg = undefined;
            }
          }

          break;
        case 'company':
          if (data[k].logoUrl.includes(';base64')) {
            const file = Buffer.from(data[k].logoUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const fileType = data[k].logoUrl.split(';')[0].split('/')[1];

            const panoName = `company_logo.${fileType}`;
            const s3Object = await s3.upload({
              Bucket: 'lidarama1media',
              Key: `${id}/${panoName}`,
              Body: file,
              ContentEncoding: 'base64',
              ACL: 'public-read',
              ContentType: `image/${fileType}`
            }).promise();

            data[k].logoUrl = s3Object.Location;
            data[k].logoKey = s3Object.Key;

          }
          break;
        default:
          ExpressionAttributeValues[`:${k}`] = data[k];
      }
      ExpressionAttributeValues[`:${k}`] = data[k];

    }

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

    const panoId = data.id || randomUUID();
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

    if (data.dark_pano?.url.includes(';base64')) {
      const file = Buffer.from(data.dark_pano.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const fileType = data.dark_pano.url.split(';')[0].split('/')[1];

      const panoFileName = `${panoId}_dark`
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
    if (data.light_pano?.url.includes(';base64')) {
      const file = Buffer.from(data.light_pano.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const fileType = data.light_pano.url.split(';')[0].split('/')[1];

      const panoFileName = `${panoId}_light`
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
        '#id': panorama.id
      },
      ExpressionAttributeValues: {
        ':panorama': panorama
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise();

  }

  async getPanorama(projectId, key) {
    return db.get({
      TableName: 'projects',
      Key: { id: projectId },
      ProjectionExpression: `panoramas.#key`,
      ExpressionAttributeNames: {
        '#key': key
      }
    }).promise().then(result => result.Item.panoramas[key]);
  }

  async updatePanorama(projectId, key, data) {

    let panorama = { ...data, updatedAt: Date.now() };

    if (data.url.includes(';base64')) {
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

    if (data.dark_pano?.url.includes(';base64')) {
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
    if (data.light_pano?.url.includes(';base64')) {
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

  async createHDRPanorama(projectId, panoramaId) {
    const panorama = await this.getPanorama(projectId, panoramaId);
    if (panorama.url && panorama.dark_pano && panorama.light_pano) {
      // Merge HDR process. Create HDR panorama on S3

      // Save url of HDR panorama into panorama object
      panorama.hdr_pano = {
        id: '',
        url: '',
        fileName: ''
      };
      this.updatePanorama(projectId, panoramaId, panorama);

    } else {

      return false;
    }
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

  async addGalleryItem(projectId, data) {
    const file = Buffer.from(data.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const fileType = data.url.split(';')[0].split('/')[1];

    const photoId = randomUUID();
    const photoName = `${photoId}.${fileType}`;
    const s3Object = await s3.upload({
      Bucket: 'lidarama1media',
      Key: `${projectId}/${photoName}`,
      Body: file,
      ContentEncoding: 'base64',
      ACL: 'public-read',
      ContentType: `image/${fileType}`
    }).promise();

    const photo = {
      ...data,
      id: photoId,
      fileName: photoName,
      url: s3Object.Location,
      createdAt: Date.now()
    };

    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      // UpdateExpression: 'set #gallery = list_append(if_not_exists(#gallery, :empty_list), :panorama)',
      UpdateExpression: `set #gallery.#id = :photo`,
      ExpressionAttributeNames: {
        '#gallery': 'gallery',
        '#id': photo.id
      },
      ExpressionAttributeValues: {
        ':photo': photo
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise();

  }

  async updateGalleryItem(projectId, photoId, data) {

    let photo = { ...data, updatedAt: Date.now() };

    if (data.url.includes(';base64')) {
      const file = Buffer.from(data.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const fileType = data.url.split(';')[0].split('/')[1];

      const panoName = `${photoId}.${fileType}`;

      const s3Object = await s3.upload({
        Bucket: 'lidarama1media',
        Key: `${projectId}/${panoName}`,
        Body: file,
        ContentEncoding: 'base64',
        ContentType: `image/${fileType}`
      }).promise();

      photo.url = s3Object.Location;

    }

    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      UpdateExpression: `set #gallery.#id = :photo`,
      ExpressionAttributeNames: {
        '#gallery': 'gallery',
        '#id': photoId
      },
      ExpressionAttributeValues: {
        ':photo': photo
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise();
  }

  deleteGalleryItem(projectId, photoId, photo) {

    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      UpdateExpression: 'remove #gallery.#key',
      ExpressionAttributeNames: {
        '#gallery': 'gallery',
        '#key': photoId
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise().then(() => {
      s3.deleteObject({
        Bucket: 'lidarama1media',
        Key: photo.fileName
      }).promise();
    });
  }
}
