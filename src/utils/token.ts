import type User from '@/interface/User'
import jwt from 'jsonwebtoken'

const JWT_TOKEN = process.env.JWT_TOKEN ?? ''
export function verifyToken (token: string): User | undefined {
  try {
    const verified = jwt.verify(token, JWT_TOKEN) as User
    return verified
  } catch (e) {
    console.error(e)
    return undefined
  }
}
