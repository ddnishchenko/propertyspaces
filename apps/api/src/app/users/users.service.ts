import { Injectable } from '@nestjs/common';

import { DynamoDB, S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { ProjectsService } from '../projects/projects.service';
import { Role } from '../roles/role.enum';
const db = new DynamoDB.DocumentClient({});
const s3 = new S3({});

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(
    private projectService: ProjectsService
  ) { }

  list() {
    return db.scan({ TableName: 'users' })
      .promise()
      .then(
        res => res.Items
          .map(item => ({ ...item, hash: undefined, salt: undefined }))
          .filter((item: any) => !item.roles.includes(Role.Admin))
      );
  }

  async create(user) {
    const userId = randomUUID();


    return db.transactWrite({
      TransactItems: [
        {
          Put: {
            TableName: 'users',
            ConditionExpression: 'attribute_not_exists(#pk)',
            ExpressionAttributeNames: {
              '#pk': 'id',
            },
            Item: {
              id: userId,
              roles: [Role.User],
              createdAt: Date.now(),
              ...user
            }
          }
        },
        {
          Put: {
            TableName: 'uniques',
            ConditionExpression: 'attribute_not_exists(#pk)',
            ExpressionAttributeNames: {
              '#pk': 'value',
            },
            Item: {
              value: user.email,
              type: 'email',
              userId
            }
          }
        }
      ]
    }).promise().then(() => user);

  }

  async findByEmail(email: string): Promise<User | undefined> {
    const uniqueEmail = await db.get({
      TableName: 'uniques',
      Key: { value: email }
    }).promise();

    return uniqueEmail.Item ? this.findById(uniqueEmail.Item.userId) : null
  }

  async findById(id: string): Promise<User | undefined> {
    return db.get({
      TableName: 'users',
      Key: {
        id
      }
    }).promise().then(r => r.Item);
  }

  async update(id, body) {
    const ExpressionAttributeValues = {};
    const data = { ...body, updatedAt: Date.now() };
    const forbiddenKeys = ['id', 'email', 'hash', 'salt']
    const keys = Object.keys(data).filter(k => !forbiddenKeys.includes(k));

    for (let k of keys) {
      switch (k) {
        case 'avatar':
          if (data[k] && data[k].includes(';base64')) {
            const file = Buffer.from(data[k].replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const fileType = data[k].split(';')[0].split('/')[1];

            const panoName = `avatar.${fileType}`;
            const s3Object = await s3.upload({
              Bucket: 'lidarama1media',
              Key: `${id}/${panoName}`,
              Body: file,
              ContentEncoding: 'base64',
              ACL: 'public-read',
              ContentType: `image/${fileType}`
            }).promise();

            data[k] = s3Object.Location;
            data[k + 'Key'] = s3Object.Key;
          }
          break;
      }
      ExpressionAttributeValues[`:${k}`] = data[k]
    };

    const UpdateExpression = `set ` + keys.map(k => `${k} = :${k}`).join(', ');
    return db.update({
      TableName: 'users',
      Key: { id },
      UpdateExpression,
      ExpressionAttributeValues,
      ReturnValues: 'UPDATED_NEW'
    }).promise();
  }

  async delete(user) {
    await this.projectService.deleteUser(user.id);
    const User = await this.findById(user.id);
    if (User.avatarKey) {
      await s3.deleteObject({
        Bucket: 'lidarama1media',
        Key: User.avatarKey
      }).promise();
    }
    return db.transactWrite({
      TransactItems: [
        {
          Delete: {
            TableName: 'users',
            Key: { id: user.id }
          }
        },
        {
          Delete: {
            TableName: 'uniques',
            Key: { value: user.email }
          }
        }
      ]
    }).promise();
  }

  async changeEmail(userId, oldEmail, newEmail) {

    return db.transactWrite({
      TransactItems: [
        {
          Delete: {
            TableName: 'uniques',
            Key: { value: oldEmail }
          }
        },
        {
          Put: {
            TableName: 'uniques',
            ConditionExpression: 'attribute_not_exists(#pk)',
            ExpressionAttributeNames: {
              '#pk': 'value',
            },
            Item: {
              value: newEmail,
              type: 'email',
              userId
            }
          }
        },
        {
          Update: {
            TableName: 'users',
            Key: { id: userId },
            UpdateExpression: 'set email = :email',
            ExpressionAttributeValues: {
              ':email': newEmail
            }
          }
        }
      ]
    }).promise();

  }

  async changePassword(userId, hash, salt) {
    await db.update({
      TableName: 'users',
      Key: { id: userId },
      UpdateExpression: 'set #hash = :hash, #salt = :salt',
      ExpressionAttributeValues: {
        ':hash': hash,
        ':salt': salt
      },
      ExpressionAttributeNames: {
        '#hash': 'hash',
        '#salt': 'salt',
      }
    }).promise()
  }
}
