import { Injectable } from '@nestjs/common';

import { DynamoDB, S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
const db = new DynamoDB.DocumentClient({});

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {

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

    return this.findById(uniqueEmail.Item.userId);
  }

  async findById(id: string): Promise<User | undefined> {
    return db.get({
      TableName: 'users',
      Key: {
        id
      }
    }).promise().then(r => r.Item);
  }

  update(id, body) {
    const ExpressionAttributeValues = {};
    const data = { ...body, updatedAt: Date.now() };
    const forbiddenKeys = ['id', 'email', 'hash', 'salt']
    const keys = Object.keys(data).filter(k => !forbiddenKeys.includes(k));
    for (let k of keys) ExpressionAttributeValues[`:${k}`] = data[k];
    const UpdateExpression = `set ` + keys.map(k => `${k} = :${k}`).join(', ');
    return db.update({
      TableName: 'users',
      Key: { id },
      UpdateExpression,
      ExpressionAttributeValues,
      ReturnValues: 'UPDATED_NEW'
    }).promise();
  }
}
