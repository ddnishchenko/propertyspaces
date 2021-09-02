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
}
