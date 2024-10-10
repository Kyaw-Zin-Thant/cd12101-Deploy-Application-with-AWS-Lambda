import { parseUserId } from '../../auth/utils.mjs'

export function getUserId(authorization) {
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
