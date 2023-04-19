import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface Location {
  username: string
  class: number
  number: number
  name: string
  floor: number
}

const inter = Inter({ subsets: ['latin'] })
export default function View (): JSX.Element {
  const [gradeInfo, setGradeInfo] = useState<number>(3)
  const [classInfo, setClassInfo] = useState<number>(1)
  const [locationData, setLocationData] = useState<Location[]>([])

  const fetchLocation = async (): Promise<void> => {
    const response = await fetch(`/api/location?grade=${gradeInfo}&class=${classInfo}`, {
      method: 'GET'
    }).then(async (res) => await res.json())

    if (response.success === false) {
      toast.error(response.message)
      return
    }

    setLocationData(response.data)
  }

  return (
    <>
      <Head>
        <title>야간자율 위치 조회</title>
        <meta name="description" content="야간자율 위치를 조회합니다." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className + ' flex h-screen bg-gray-200'}>
        <div className="m-auto w-5/12">
          <div className='shadow-2xl p-10 rounded-lg bg-white flex flex-col'>
            <Image alt='로고' width={50} height={50} src='/logo.png' className='' />
            <h1 className='font-bold text-xl'>야간자율학습 위치 조회</h1>
            <small>교내 와이파이가 아닐경우 조회가 불가능합니다.</small>
            <div className='flex gap-1 w-80'>
              <select value={gradeInfo} onChange={(e) => { setGradeInfo(Number(e.target.value)) }} className='mt-3 border-none bg-whitebg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
              </select>
              <select value={classInfo} onChange={(e) => { setClassInfo(Number(e.target.value)) }} className='mt-3 border-none bg-whitebg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                <option value="1">1반</option>
                <option value="2">2반</option>
                <option value="3">3반</option>
              </select>
              <button onClick={ () => { void fetchLocation() }} className='w-full bg-green-400 text-white mt-3 px-1 py-1 rounded-md hover:bg-green-500 hover:shadow-md active:shadow-none'>위치 조회</button>

            </div>
            <div className="relative overflow-x-auto mt-3">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 py-3">
                                번호
                            </th>
                            <th scope="col" className="px-3 py-3">
                                이름
                            </th>
                            <th scope="col" className="px-6 py-3">
                                위치
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                      { locationData.map((v: Location, i: number) => (
                        <tr className="bg-white border-b" key={i}>
                          <td className="px-3 py-4">
                              {v.number}
                          </td>
                          <td className="px-3 py-4">
                              {v.username}
                          </td>
                          <td className="px-6 py-4">
                              {v.floor}층 {v.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
