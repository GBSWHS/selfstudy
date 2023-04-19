import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>없는 페이지</title>
        <meta name="description" content="없는 페이지 입니다." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>길을 잘못 드셨나봐요!</h1>
        <p>원래 길을 찾아가세요!</p>
        <button onClick={() => router.push('/')}>move to home</button>
      </main>
    </>
  )
}
