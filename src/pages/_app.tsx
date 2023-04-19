import '@/styles/global.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

export default function App ({ Component, pageProps }: AppProps): JSX.Element {
  return <>
    <Component {...pageProps} />
    <Toaster
    position="top-center"
    reverseOrder={false}
    />
  </>
}
