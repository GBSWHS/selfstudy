import type { NextApiRequest, NextApiResponse } from 'next'
import db from '@/utils/database'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'GET') void getHandler(req, res)
  else res.status(405).json('허용되지 않은 요청 유형입니다.')
}

async function getHandler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const zones = await db.select('*')
    .from('zones')
    .where({ disabled: 0 })

  res.status(200).json({ success: true, data: zones })
}
