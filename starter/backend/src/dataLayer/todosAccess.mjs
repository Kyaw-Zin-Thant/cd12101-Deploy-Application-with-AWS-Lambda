import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import AWSXRay from 'aws-xray-sdk-core';
import { createLogger } from '../utils/logger.mjs';

const logger = new createLogger('Todos');

export class TodosAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE
  ) {
    this.documentClient = documentClient;
    this.todosTable = todosTable;
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient);
  }

  async getAllTodos(userId) {
    console.log(`Retrieving all todos for userId: ${userId} from table: ${this.todosTable}`);

    try {
      const result = await this.dynamoDbClient.query({
        TableName: this.todosTable,
        IndexName: process.env.TODO_USER_ID_INDEX,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      });
      logger.info('Todos retrieved successfully');
      return result.Items;
    } catch (error) {
      console.error('Error fetching todos:', error);
      logger.error('Error fetching todos', error);
    }
  }

  async createTodo(newTodo) {
    console.log(`Creating todo with ID: ${newTodo.todoId}`);

    try {
      await this.dynamoDbClient.put({
        TableName: this.todosTable,
        Item: newTodo
      });
      logger.info('Todo created successfully');
      return newTodo;
    } catch (error) {
      console.error('Todo creation failed:', error);
      logger.error('Todo creation failed', error);
      return undefined;
    }
  }

  async updateTodo(updatedTodo) {
    console.log(`Updating todo with ID: ${updatedTodo.todoId}`);
    
    try {
      await this.dynamoDbClient.update({
        TableName: this.todosTable,
        Key: { todoId: updatedTodo.todoId, userId: updatedTodo.userId },
        UpdateExpression: 'set name = :name, completed = :completed',
        ExpressionAttributeValues: {
          ':name': updatedTodo.name,
          ':completed': updatedTodo.completed // Changed to match original naming
        },
        ReturnValues: 'UPDATED_NEW'
      });
      logger.info('Todo updated successfully');
      return updatedTodo;
    } catch (error) {
      console.error('Todo update failed:', error);
      logger.error('Todo update failed', error);
      return undefined;
    }
  }

  async updateAttachment(todoId, userId, attachmentUrl) {
    console.log(`Updating attachment for todoId: ${todoId}`);

    try {
      await this.dynamoDbClient.update({
        TableName: this.todosTable,
        Key: { todoId, userId },
        UpdateExpression: 'set attachmentUrl = :url',
        ExpressionAttributeValues: {
          ':url': attachmentUrl
        }
      });
      logger.info('Attachment updated successfully');
    } catch (error) {
      console.error('Attachment update failed:', error);
      logger.error('Attachment update failed', error);
    }
  }

  async deleteTodo(todoId, userId) {
    console.log(`Deleting todo with ID: ${todoId}`);

    try {
      await this.dynamoDbClient.delete({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        }
      });
      logger.info('Todo deleted successfully');
      return {};
    } catch (error) {
      console.error('Todo deletion failed:', error);
      logger.error('Todo deletion failed', error);
      return undefined;
    }
  }
}
