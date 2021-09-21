import { Injectable, BadRequestException } from '@nestjs/common';

import { DynamoDB, S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';

import { Role } from '../roles/role.enum';
const db = new DynamoDB.DocumentClient({});
const s3 = new S3({});

@Injectable()
export class ProjectsService {
  read(id) {
    return db.get({
      TableName: 'projects',
      Key: { id }
    }).promise();
  }
  list(userId?) {
    const FilterExpression = userId ? 'userId = :userId' : undefined;
    const ExpressionAttributeValues = userId ? { ':userId': userId } : undefined;
    return db.scan({
      TableName: 'projects',
      ExpressionAttributeValues,
      ExpressionAttributeNames: { '#name': 'name' },
      ProjectionExpression: 'id,#name,addr,userId,createdAt,updatedAt',
      FilterExpression
    }).promise();
  }
  put(data, id?) {
    const Item = { id: id ? id : randomUUID(), ...data };
    return db.put({ TableName: 'projects', Item }).promise().then(() => Item);
  }
  async update(id, body, user) {
    const isAdmin = user.roles.includes(Role.Admin);
    const ExpressionAttributeValues = isAdmin ? {} : { [`:userId`]: user.id };
    const ConditionExpression = isAdmin ? undefined : 'userId = :userId';
    const data = { ...body, updatedAt: Date.now() };
    const excludedKeys = ['id', 'panoramas', 'gallery'];
    const keys = Object.keys(data).filter(k => !excludedKeys.includes(k));

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
    const ExpressionAttributeNames = {};
    const UpdateExpression = `set ` + keys.map(k => {
      ExpressionAttributeNames[`#${k}`] = k;
      return `#${k} = :${k}`;
    }).join(', ');

    return db.update({
      TableName: 'projects',
      Key: { id },
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'UPDATED_NEW',
      ConditionExpression
    }).promise();
  }

  delete(id: string, user) {
    const isAdmin = user.roles.includes(Role.Admin);
    const ExpressionAttributeValues = isAdmin ? undefined : { [`:userId`]: user.id };
    const ConditionExpression = isAdmin ? undefined : 'userId = :userId';

    return db.delete({
      TableName: 'projects',
      Key: { id },
      ConditionExpression,
      ExpressionAttributeValues
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

  async deleteUser(userId) {
    const projects = await this.list(userId);
    const deleteProjects = projects.Items.map(p => this.delete(p.id, userId))
    return Promise.all(deleteProjects);

  }

  async createPanorama(projectId, data, user) {
    const isAdmin = user.roles.includes(Role.Admin);
    const ExpressionAttributeValues = isAdmin ? {} : { [`:userId`]: user.id };
    const ConditionExpression = isAdmin ? undefined : 'userId = :userId';

    let panorama = data;
    panorama.id = data.id || randomUUID()
    const panoId = panorama.id;
    if (data.url.includes(';base64')) {
      const file = Buffer.from(data.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      let fileType = data.url.split(';')[0].split('/')[1] || 'jpeg';
      fileType = fileType === '9j' ? 'jpeg' : fileType;

      const panoName = `${panoId}.${fileType}`;
      const s3Object = await s3.upload({
        Bucket: 'lidarama1media',
        Key: `${projectId}/${panoName}`,
        Body: file,
        ContentEncoding: 'base64',
        ACL: 'public-read',
        ContentType: `image/${fileType}`
      }).promise();

      console.log(s3Object);

      panorama = {
        ...panorama,
        id: panoId,
        fileName: panoName,
        url: s3Object.Location,
        createdAt: Date.now()
      };
    } else {
      throw new BadRequestException({ message: 'url parameter should be valid base64 string' });
    }


    if (data.dark_pano?.url.includes(';base64')) {
      const file = Buffer.from(data.dark_pano.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      let fileType = data.dark_pano.url.split(';')[0].split('/')[1] || 'jpeg';
      fileType = fileType === '9j' ? 'jpeg' : fileType;

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
      let fileType = data.light_pano.url.split(';')[0].split('/')[1] || 'jpeg';
      fileType = fileType === '9j' ? 'jpeg' : fileType;

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
      UpdateExpression: `set #panoramas.#id = :panorama`,
      ExpressionAttributeNames: {
        '#panoramas': 'panoramas',
        '#id': panoId
      },
      ExpressionAttributeValues: {
        ':panorama': panorama,
        ...ExpressionAttributeValues
      },
      ConditionExpression,
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

  async updatePanorama(projectId, key, data, user) {


    const panorama = { ...data, updatedAt: Date.now() };

    if (data.url.includes(';base64')) {
      const file = Buffer.from(data.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      let fileType = data.url.split(';')[0].split('/')[1] || 'jpeg';
      fileType = fileType === '9j' ? 'jpeg' : fileType;

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
      let fileType = data.dark_pano.url.split(';')[0].split('/')[1] || 'jpeg';
      fileType = fileType === '9j' ? 'jpeg' : fileType;

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
      let fileType = data.light_pano.url.split(';')[0].split('/')[1] || 'jpeg';
      fileType = fileType === '9j' ? 'jpeg' : fileType;

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
    const isAdmin = user.roles.includes(Role.Admin);
    const ExpressionAttributeValues = isAdmin ? {} : { [`:userId`]: user.id };
    const ConditionExpression = isAdmin ? undefined : 'userId = :userId';


    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      UpdateExpression: `set #panoramas.#id = :panorama`,
      ExpressionAttributeNames: {
        '#panoramas': 'panoramas',
        '#id': key
      },
      ExpressionAttributeValues: {
        ':panorama': panorama,
        ...ExpressionAttributeValues
      },
      ConditionExpression,
      ReturnValues: 'UPDATED_NEW'
    }).promise();

  }

  async createHDRPanorama(projectId, panoramaId, user) {
    // TODO: prevent other users from creating panoramas to project
    const panorama = await this.getPanorama(projectId, panoramaId);
    if (panorama.url && panorama.dark_pano && panorama.light_pano) {
      // Merge HDR process. Create HDR panorama on S3

      // Save url of HDR panorama into panorama object
      panorama.hdr_pano = {
        id: '',
        url: '',
        fileName: ''
      };
      this.updatePanorama(projectId, panoramaId, panorama, user);

    } else {

      return false;
    }
  }

  deletePanorama(projectId, panoId, panorama, user) {

    const isAdmin = user.roles.includes(Role.Admin);
    const ExpressionAttributeValues = isAdmin ? undefined : { [`:userId`]: user.id };
    const ConditionExpression = isAdmin ? undefined : 'userId = :userId';

    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      UpdateExpression: 'remove #panoramas.#key',
      ExpressionAttributeNames: {
        '#panoramas': 'panoramas',
        '#key': panoId
      },
      ExpressionAttributeValues,
      ConditionExpression,
      ReturnValues: 'UPDATED_NEW'
    }).promise().then(() => {
      s3.deleteObject({
        Bucket: 'lidarama1media',
        Key: panorama.fileName
      }).promise();
    });
  }

  async addGalleryItem(projectId, data, user) {
    const file = Buffer.from(data.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const fileType = data.url.split(';')[0].split('/')[1] || 'jpeg';

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

    const isAdmin = user.roles.includes(Role.Admin);
    const ExpressionAttributeValues = isAdmin ? {} : { [`:userId`]: user.id };
    const ConditionExpression = isAdmin ? undefined : 'userId = :userId';

    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      UpdateExpression: `set #gallery.#id = :photo`,
      ExpressionAttributeNames: {
        '#gallery': 'gallery',
        '#id': photo.id
      },
      ExpressionAttributeValues: {
        ':photo': photo,
        ...ExpressionAttributeValues
      },
      ConditionExpression,
      ReturnValues: 'UPDATED_NEW'
    }).promise();

  }

  async updateGalleryItem(projectId, photoId, data, user) {

    const photo = { ...data, updatedAt: Date.now() };

    if (data.url.includes(';base64')) {
      const file = Buffer.from(data.url.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const fileType = data.url.split(';')[0].split('/')[1] || 'jpeg';

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

    const isAdmin = user.roles.includes(Role.Admin);
    const ExpressionAttributeValues = isAdmin ? {} : { [`:userId`]: user.id };
    const ConditionExpression = isAdmin ? undefined : 'userId = :userId';

    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      UpdateExpression: `set #gallery.#id = :photo`,
      ExpressionAttributeNames: {
        '#gallery': 'gallery',
        '#id': photoId
      },
      ExpressionAttributeValues: {
        ':photo': photo,
        ...ExpressionAttributeValues
      },
      ConditionExpression,
      ReturnValues: 'UPDATED_NEW'
    }).promise();
  }

  deleteGalleryItem(projectId, photoId, photo, user) {
    const isAdmin = user.roles.includes(Role.Admin);
    const ExpressionAttributeValues = isAdmin ? undefined : { [`:userId`]: user.id };
    const ConditionExpression = isAdmin ? undefined : 'userId = :userId';

    return db.update({
      TableName: 'projects',
      Key: { id: projectId },
      UpdateExpression: 'remove #gallery.#key',
      ExpressionAttributeNames: {
        '#gallery': 'gallery',
        '#key': photoId
      },
      ExpressionAttributeValues,
      ConditionExpression,
      ReturnValues: 'UPDATED_NEW'
    }).promise().then(() => {
      s3.deleteObject({
        Bucket: 'lidarama1media',
        Key: photo.fileName,
      }).promise();
    });
  }

  getS3Object(project, key) {
    /* return s3.getObject({
      Bucket: 'lidarama1media',
      Key: project + '/' + key,
    }); */
    const signedUrlExpireSeconds = 60 * 2;
    const url = s3.getSignedUrl('getObject', {
      Bucket: 'lidarama1media',
      Key: project + '/' + key,
      Expires: signedUrlExpireSeconds
    });
    return url;
  }
}
