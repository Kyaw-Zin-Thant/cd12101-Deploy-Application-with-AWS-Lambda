import middy from '@middy/core'
import cors from '@middy/http-cors'
import { getUserId } from '../auth/utils.mjs'
import { getAllTodos } from '../../businessLogic/todo.mjs'
export const handler = middy()
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    
    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)
    const todoList = await getAllTodos(userId)

    if (!todoList.length) {
      return {
        statusCode: 400,
        message: "Bad Request"
        
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todoList
      })
    }
  })
