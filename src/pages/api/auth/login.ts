import { type NextApiRequest, type NextApiResponse } from 'next'

const CLIENT_ID = process.env.CLIENT_ID ?? ''
const SCOPE = process.env.SCOPE ?? ''
const REDIRECT_URI = process.env.REDIRECT_URI ?? ''
export default function handler (req: NextApiRequest, res: NextApiResponse): void {
  const url = 'https://center.gbsw.hs.kr/login' +
    '?scope=' + SCOPE +
    '&client_id=' + CLIENT_ID +
    '&redirect_uri=' + REDIRECT_URI +
    '&nonce=none&response_type=id_token'

  res.redirect(url)
}
