import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import axios from 'axios'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const token = req.query.id_token as string
  if (token === undefined) { res.status(400).json({ success: false, message: '잘못된 요청' }); return }

  const PUBKEY_URI = process.env.PUBLIC_KEY ?? ''
  const pubkey = await axios({ url: PUBKEY_URI, method: 'get' }).then((res) => res.data)

  try {
    const verified = jwt.verify(token, pubkey, {
      algorithms: ['ES256'],
      audience: process.env.CLIENT_ID,
      issuer: process.env.ISSUER
    }) as any

    const { fullname, classInfo, type } = verified.data

    const JWT_TOKEN = process.env.JWT_TOKEN ?? ''
    const signtoken = jwt.sign({
      username: fullname,
      class: classInfo,
      type
    }, JWT_TOKEN, {
      expiresIn: '30m'
    })

    res
      .status(200)
      .setHeader('Set-Cookie', `token=${signtoken}; path=/; HttpOnly`)
      .redirect('/')
  } catch (e) {
    console.error(e)
    res.status(401).json({ success: false, message: '잘못된 인증 정보입니다.' })
  }
}
