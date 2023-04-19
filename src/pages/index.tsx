import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Inter } from 'next/font/google'
import useSWR from 'swr'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })
const fetcher = async (url: string): Promise<any> => await fetch(url).then(async (res) => await res.json())
export default function Home (): JSX.Element {
  const { data, error, isLoading } = useSWR('/api/auth/me', fetcher)
  const { data: zoneData, error: zoneError, isLoading: zoneIsLoading } = useSWR('/api/zones', fetcher)

  const [selectedZoneId, setSelectedZoneId] = useState<string>('0')
  const router = useRouter()

  if (isLoading || zoneIsLoading || !router.isReady) return <div>데이터 로딩중</div>
  if (error !== undefined || zoneError !== undefined) return <div>데이터를 불러올 수 없음</div>

  async function submitLocation (): Promise<void> {
    if (selectedZoneId === undefined || selectedZoneId === '0') {
      toast.error('구역을 먼저 선택해주세요')
      return
    }
    console.log(selectedZoneId)

    if (!confirm('정말로 해당 구역으로 등록하시겠습니까?\n등록 후 구역을 수정할 수 없습니다. ')) return

    const response = await fetch('/api/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zoneid: Number(selectedZoneId) })
    }).then(async (res) => await res.json())
    if (response.success === false) {
      toast.error(response.message)
      return
    }

    toast.success('야간자율 정보를 등록하였습니다!')
    router.reload()
  }

  return (
    <>
      <Head>
        <title>야간자율 위치</title>
        <meta name="description" content="야간자율 위치를 설정하세요." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className + ' flex h-screen bg-gray-200'}>
        <div className="m-auto">
          <div className='shadow-2xl p-10 rounded-lg bg-white flex flex-col'>
            <Image alt='로고' width={50} height={50} src='/logo.png' className='' />
            <h1 className='font-bold text-xl'>야간자율학습 위치 보고</h1>
            { data.success === true
              ? <>
                <span>{data.data.user.class.grade}학년 {data.data.user.class.class}반 {data.data.user.class.number}번 {data.data.username}</span>
                <small className='cursor-pointer' onClick={() => { void router.push('/api/auth/logout') }}>로그아웃</small>
                {
                  data.data.location === undefined
                    ? <>
                        <select value={selectedZoneId} onChange={(e) => { setSelectedZoneId(e.target.value) }} className='mt-3 border-none bg-whitebg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                          <option value='0'>-- 위치를 선택해주세요. --</option>
                          {zoneData.data.map((v: any) => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                          ))}
                        </select>
                        <button onClick={() => { void submitLocation() }} className='w-full bg-green-400 text-white mt-3 p-3 rounded-md hover:bg-green-500 hover:shadow-md active:shadow-none'>위치 등록</button>
                      </>
                    : <span className='mt-3'>이미 {data.data.location.floor}층 {data.data.location.name}(으)로 위치를 저장했습니다.</span>
                }
              </>
              : <button className='w-full bg-green-400 text-white mt-3 p-3 rounded-md hover:bg-green-500 hover:shadow-md active:shadow-none' onClick={ () => { void router.push('/api/auth/login') }}>로그인하기</button>
            }
          </div>
          <button onClick={() => { void router.push('/view') }} className='w-full bg-white mt-3 p-3 rounded-md shadow-xl font-medium hover:shadow-sm active:shadow-none'>위치 조회</button>
        </div>
      </main>
    </>
  )
}
