/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */

'use client'
import 'assets/css/main.css'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'

import 'react-multi-carousel/lib/styles.css'
import 'react-toastify/dist/ReactToastify.css'
import 'swiper/css'
import AuthProvider from './components/AuthProvider/AuthProvider'

import NoFirstRender from 'design-systems/Atoms/NoFirstRender'
import Footer from 'design-systems/Organisms/Footer'
import Header from 'design-systems/Organisms/Header'
import MobileHeader from 'design-systems/Organisms/MobileHeader.tsx'
import SideNavbar from 'design-systems/Organisms/SideNavBar'
import { TopNavbar } from 'design-systems/Organisms/TopNavBar'
import { allowedPathnames, hidePathnames } from 'design-systems/data/data'
import ReduxProviders from 'lib/providers'
import 'tw-elements-react/dist/css/tw-elements-react.min.css'

import { ReactQueryDevtools } from 'react-query/devtools'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/zoom'
// import { useDispatch } from 'react-redux'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function Providers({ children }: PropsWithChildren) {
  // const dispatch = useDispatch()
  // useMemo(() => {
  //   const LocalWallet = localStorage.getItem('walletLoading')
  //   if (LocalWallet !== null) {
  //     // setWalletLoading(JSON.parse(LocalWallet))
  //     dispatch(WalletLoading(JSON.parse(LocalWallet)))
  //   }
  // }, [])
  return (
    <>
      <ReduxProviders>
        <QueryClientProvider client={queryClient}>
          {' '}
          <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </QueryClientProvider>
      </ReduxProviders>
    </>
  )
}
function RestrictedRoute({ children }: { children: React.ReactNode }) {
  // const router = useRouter()
  // const pathname = usePathname()
  // const token = localStorage?.getItem('token')
  // useEffect(() => {
  //   const currentPath = pathname

  //   if (!token && !UnrestrictRoute.includes(currentPath)) {
  //     toast.warning('Route Restricted please login / signup', {
  //       position: toast.POSITION.TOP_RIGHT,
  //     })
  //     router.push('/login')
  //   }
  // }, [router])

  // Please uncomment if want protected route.

  return <>{children}</>
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [noComponent, setNoComponent] = useState<boolean>(false)
  const [hide, setHide] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [ModelName, setModelName] = useState<string>('NOVA')
  const [userData, setUserData] = useState({})

  const localUserData = typeof window !== 'undefined' ? localStorage?.getItem('UserData') : ''
  useEffect(() => {
    try {
      if (localUserData && localUserData !== undefined && localUserData !== null) {
        const parsedUserData = JSON?.parse(localUserData)
        setUserData(parsedUserData)
      }
    } catch (error) {
      console.error('Error parsing UserData:', error)
      // Handle the error (e.g., set default values or show a message to the user)
    }
  }, [localUserData])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (allowedPathnames.includes(pathname)) {
        setNoComponent(true)
      }
    }
    return () => {
      setNoComponent(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (hidePathnames.includes(pathname)) {
        setHide(true)
      }
    }
    return () => {
      setHide(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
  return (
    <html lang="en">
      <Head>
        {/* <link rel="icon" href="../../public/Group.png" /> */}
        <meta charSet="utf-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          name="viewport"
        />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="default" name="apple-mobile-web-app-status-bar-style" />
        <meta content="yes" name="mobile-web-app-capable" />
        <meta content="website" name="og:type" property="og:type" />
        <meta content="summary_large_image" name="twitter:card" />
      </Head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Providers>
            <NoFirstRender>
              <AuthProvider>
                <RestrictedRoute>
                  {!noComponent && (
                    <div className="fixed z-[1000] w-full  font-Lexend ">
                      <div className="hidden xm:!flex">
                        <Header hide={hide} noComponent={noComponent} userData={userData} />
                      </div>
                      <div>
                        <div className="flex xm:!hidden">
                          <MobileHeader ModelName={ModelName} open={open} setOpen={setOpen} />
                        </div>
                        {open && (
                          <div className="flex xm:!hidden">
                            <TopNavbar
                              hide={hide}
                              open={open}
                              setModelName={setModelName}
                              setOpen={setOpen}
                              userData={userData}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div
                    className={
                      pathname === '/mint'
                        ? ''
                        : pathname === '/' || pathname === '/login'
                        ? 'h-screen'
                        : 'flex h-[calc(100vh_-_70px)] overflow-scroll'
                    }
                  >
                    {!noComponent && !hide && (
                      <>
                        <div className="!hidden md:!flex md:flex-row">
                          <SideNavbar />
                        </div>
                      </>
                    )}
                    <div className="m-0 flex min-h-full w-full overflow-scroll p-0 text-center">
                      <div
                        className={` ${
                          !noComponent && !hide && '!mt-[87px] !py-[22px] px-[22px] md:!px-[36px]'
                        } w-full`}
                      >
                        {children}
                      </div>
                    </div>
                  </div>
                  {!noComponent && <Footer />}
                </RestrictedRoute>
                <ToastContainer />
              </AuthProvider>
            </NoFirstRender>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
