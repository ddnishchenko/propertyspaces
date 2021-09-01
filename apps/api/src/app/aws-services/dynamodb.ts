import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';

const region = 'us-west-2';
const client = new DynamoDBClient({ region });


export class DB {
  constructor(
    private tableName
  ) { }
  create(Item) {
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item
    });
    return client.send(command);
  }
  read(id) {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: { id }
    });
    return client.send(command);
  }
  update(id: string, options) {
    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: { id },
      ...options
    });
    return client.send(command)
  }
  delete(id) {
    const command = new DeleteItemCommand({
      TableName: this.tableName,
      Key: { id }
    });
    return client.send(command);
  }
}
