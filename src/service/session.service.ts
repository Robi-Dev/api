import config from 'config'
import {get} from 'lodash'
import {SessionModel} from '../models/session.model'
import {signJwt, verifyJwt} from '../utils/jwt.utils'
import {findUser} from './user.service'
import logger from '../utils/logger'

const ACCESS_TOKEN_EXPIRES_IN = config.get<number>('accessTokenExpireTime')

export async function createUserSession(userId: any, userAgent: any) {
  return await SessionModel.create({
    user: userId,
    userAgent,
  })
}

// Reissue AccessToken

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string
}) {
  const { decoded } = await verifyJwt(refreshToken)
  if (!decoded || !get(decoded, 'session')) return false

  const session = await SessionModel.findById(get(decoded, 'session'))
  if (!session || !session.valid) return false

  // find user from session
  const user = await findUser({ id: session.user })
  if (!user) {
    logger.info('user not found')
    return false
  }

  const accessToken = signJwt(
    {
      ...user,
      session: session._id,
    },
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  )
  return accessToken
}
