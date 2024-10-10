import * as uuid from 'uuid';
import { TodosAccess } from '../dataLayer/todosAccess.mjs';
import { getUploadUrl } from '../fileStorage/attachmentUtils.mjs';

const todoAccess = new TodosAccess();

export async function getAllTodos(userId) {
  return todoAccess.getAllTodos(userId);
}

export async function createTodo(request, userId) {
  const newTodoId = uuid.v4()
  console.log(request);
  console.log(newTodoId);

  
  if (request?.name && request?.name.length>0) {
    const todoItem = {
      todoId: newTodoId,
      userId,
      name: request.name,
      dueDate: request.dueDate,
      attachmentUrl: request.attachmentUrl,
      createdAt: new Date().toISOString(),
      completed: false
    };
    console.log(todoItem+ " checking it ");
    
    return await todoAccess.createTodo(todoItem);
  }
  
  return undefined;
}

export async function updateTodo(request, todoId, userId) {
  const updatedTodo = {
    todoId,
    userId,
    name: request.name,
    dueDate: request.dueDate,
    attachmentUrl: request.attachmentUrl,
    completed: request.completed
  };
  return await todoAccess.updateTodo(updatedTodo);
}

export async function deleteTodo(todoId, userId) {
  return await todoAccess.deleteTodo(todoId, userId);
}

export async function generateUploadUrl(todoId, userId) {
  const uploadUrl = await getUploadUrl(todoId);
  const attachmentUrl = uploadUrl.split('?')[0];

  await todoAccess.updateAttachment(todoId, userId, attachmentUrl);

  console.log(`Generated and saved attachment URL: ${attachmentUrl}`);
  return uploadUrl;
}
