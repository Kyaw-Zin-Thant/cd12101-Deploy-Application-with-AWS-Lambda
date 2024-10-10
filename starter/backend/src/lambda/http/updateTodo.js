import cors from '@middy/http-cors'
import middy from '@middy/core'
import { getUserId } from '../auth/utils.mjs'
import { updateTodo } from '../../businessLogic/todo.mjs'

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
    const updatedTodo = JSON.parse(event.body)
    const result = await updateTodo(updatedTodo, todoId, userId)

    if (!result) {
      return {
        statusCode: 500,
        message: "something went wrong"
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: {
          name: result.name,
          dueDate: result.dueDate,
          done: result.done
        }
      })
    }
  })
