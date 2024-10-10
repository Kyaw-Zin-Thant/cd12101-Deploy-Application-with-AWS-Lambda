import cors from '@middy/http-cors'
import middy from '@middy/core'
import { getUserId } from '../auth/utils.mjs'
import { generateUploadUrl } from '../../businessLogic/todo.mjs'

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
  
    const uploadUrl = await generateUploadUrl(todoId, userId)
    if (!uploadUrl) return { statusCode: 500, message: "something went wrong" }

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  })
