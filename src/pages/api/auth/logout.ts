import { type NextApiRequest, type NextApiResponse } from 'next'

export default function handler (req: NextApiRequest, res: NextApiResponse): void {
  res
    .status(200)
    .setHeader('Set-Cookie', 'token=; path=/; HttpOnly')
    .redirect('/')
}
