import { Injectable } from '@nestjs/common';

import { DynamoDB, S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
const db = new DynamoDB.DocumentClient({});

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  async create(user) {
    return db.put({
      TableName: 'users',
      Item: { id: randomUUID(), createdAt: Date.now(), ...user },
    }).promise().then(() => user);
  }
  async findByEmail(email: string): Promise<User | undefined> {
    return db.get({
      TableName: 'users',
      Key: { email }
    }).promise();
  }
}
