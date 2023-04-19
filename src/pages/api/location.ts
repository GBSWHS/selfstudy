import * as cookie from 'cookie'
import { verifyToken } from '@/utils/token'
import type { NextApiRequest, NextApiResponse } from 'next'
import db from '@/utils/database'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'GET') void getHandler(req, res)
  else if (req.method === 'POST') void postHandler(req, res)
  else res.status(405).json('허용되지 않은 요청 유형입니다.')
}

// const SCHOOL_IP = process.env.SCHOOL_IP ?? ''
async function getHandler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const ip = req.headers['x-real-ip'] ?? req.socket.remoteAddress
  if (ip === undefined) {
    res.status(400).json({ success: false, message: '아이피 정보를 불러올 수 없습니다.' })
    return
  }

  // if (ip !== SCHOOL_IP) {
  //   res.status(400).json({ success: false, message: '허용되지않은 아이피입니다.' })
  //   return
  // }

  const { grade, class: classInfo } = req.query
  if (grade === undefined || classInfo === undefined) {
    res.status(400).json({ success: false, message: '잘못된 요청입니다.' })
    return
  }

  const location = await db.select('*')
    .from('location')
    .where({ grade, class: classInfo })
    .whereRaw('DATE(created_at) = CURDATE()')
    .rightJoin('zones', 'location.zoneid', '=', 'zones.id')
    .orderBy('number', 'asc')

  res.status(200).json({ success: true, data: location })
}

async function postHandler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { zoneid } = req.body
  if (zoneid === undefined) {
    res.status(400).json({ success: false, message: '잘못된 요청입니다.' })
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
  const { username, class: { grade, class: classInfo, number } } = user

  try {
    const zoneExist = await db.select('*')
      .from('zones')
      .where({ id: zoneid, disabled: 0 })
      .first()
    if (zoneExist === undefined) {
      res.status(400).json({ success: false, message: '해당 구역을 찾을 수 없습니다.' })
      return
    }

    const studyExist = await db.select('*')
      .from('location')
      .whereRaw('DATE(created_at) = CURDATE()')
      .first()
    if (studyExist !== undefined) {
      res.status(400).json({ success: false, message: '이미 야간자율 정보를 등록했습니다.' })
      return
    }

    await db('location')
      .insert({ username, grade, class: classInfo, number, zoneid })

    res.status(200).json({ success: true, message: '야간자율 정보를 등록하였습니다!' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ success: false, message: '야간자율 정보를 등록할 수 없습니다.' })
  }
}
