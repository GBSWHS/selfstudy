import { type NextApiRequest, type NextApiResponse } from 'next'
import * as cookie from 'cookie'
import { verifyToken } from '@/utils/token'

export default function handler (req: NextApiRequest, res: NextApiResponse): void {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, message: '허용되지 않은 요청 유형입니다.' })
    return
  }

  const { token } = cookie.parse(req.headers.cookie ?? '')
  if (token === undefined) {
    res.status(400).json({ success: false, message: '인증 정보를 불러올 수 없습니다.' })
    return
  }

  const user = verifyToken(token)
  if (user === undefined) {
    res.status(400).json({ success: false, message: '인증 정보를 불러올 수 없습니다.' })
    return
  }

  res.status(200).json({ success: true, data: user })
}
