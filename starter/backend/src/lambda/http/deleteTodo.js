import cors from '@middy/http-cors'
import middy from '@middy/core'
import { getUserId } from '../auth/utils.mjs'
import { deleteTodo } from '../../businessLogic/todo.mjs'

export const handler = middy()
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)

    const result = await deleteTodo(todoId, userId)

    if (!result) {
      return {
        statusCode: 500,
        message: "something went wrong"
      }
    }

    return {
      statusCode: 201,
      body: JSON.stringify({})
    }
  })
