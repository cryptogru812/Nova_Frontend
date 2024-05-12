/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
'use client'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import logo from 'assets/images/adaLogo.png'
import Button from 'design-systems/Atoms/Button'
import { NovaLogo, PersonAvtar, PlusOutlined } from 'design-systems/Atoms/Icons'
import Typography from 'design-systems/Atoms/Typography'
import WalletSignUp from 'design-systems/Molecules/ModalMolecules/WalletSignUp'
import NavTabsMolecule from 'design-systems/Molecules/NavTabs/NavTabsMolecule'
import OnSelect from 'design-systems/Molecules/OnSelect'
import SearchMolecule from 'design-systems/Molecules/Search/SearchMolecule'
import { ADAdata } from 'design-systems/data/data'
import { setCrypto, tabs } from 'lib/redux/slices/navToggleSlice'
import { cryptoProps } from 'lib/redux/slices/navToggleSlice/interface'
import { RootState, useDataSelector } from 'lib/redux/store'
declare global {
  interface Window {
    cardano: any
  }
}
const Header: React.FC<any> = ({ noComponent, hide, userData }) => {
  const dispatch = useDispatch()
  const tabCount = useSelector((state: RootState) => state.toggle.tabName)
  const { crypto } = useDataSelector('toggle')
  const [walletConnected, setWalletConnected] = useState(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<number>(0)

  const openModal = () => {
    setModalOpen(true)
  }

  // useEffect(() => {
  //   if(crypto){
  //     dispatch(setCrypto({ img: ADAdata[0].img, label: ADAdata[0].label, symbol: ADAdata[0].symbol, value: ADAdata[0].value }));
  //   }
  // }, [dispatch]);
  // const { isEnabled, isConnected, enabledWallet, stakeAddress, signMessage, connect, disconnect } = useCardano()

  const router = useRouter()
  const session = useSession()
  const pathname = usePathname()

  const hasToken = localStorage.getItem('token') !== null
  const handleSignOut = () => {
    signOut()
    // Remove the 'token' item from localStorage
    // localStorage.removeItem('token')
    // localStorage.removeItem('authName')
    // localStorage.removeItem('buttonAuth')
    // dispatch(walletData([]))
    localStorage.clear()
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  const handleSelectADA = (selectedOption: cryptoProps) => {
    dispatch(setCrypto(selectedOption))
  }
  const handleSelect = (selectedOption: string) => {}

  const handleTabChange = (tab: number) => {
    dispatch(tabs(tab))
  }

  return (
    <div className="fixed flex w-full bg-gradint-dark-pink pb-[2px]">
      <div className="flex w-full flex-row  items-center justify-between gap-[22px] bg-blackBg p-4">
        <div className="ml-1 flex items-center gap-7">
          {' '}
          <div className="flex flex-row gap-[22px] space-x-2">
            <NovaLogo className="aspect-square" />
            <div className="flex flex-col">
              <Typography className="font-Lexend font-normal tracking-logo" size="h4">
                NOVA
              </Typography>
              <Typography className="font-Lexend tracking-logo1" size="body">
                SOLUTIONS
              </Typography>
            </div>
          </div>
          {pathname !== '/account' && !hide && (
            <>
              {pathname !== '/project' && (
                <NavTabsMolecule
                  activeTab={tabCount}
                  className="!bg-blackBg"
                  classNameInner="!bg-blackBg"
                  tabs={['All', 'NFT', 'Token']}
                  onTabChange={handleTabChange}
                />
              )}
              <div className="h-[56px] w-[120px]">
                <OnSelect
                  className="h-[56px] !w-full "
                  imageHeight={0}
                  imageSrc={''}
                  imageWidth={0}
                  options={['1 day', '7 days', '30 days', '90 days', '1 year', 'All']}
                  onSelect={handleSelect}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 lg:!mr-6">
          {' '}
          {!hide && <SearchMolecule />}
          {hide && (
            <Button
              className="flex h-[52px] rounded-[6px]  bg-gradint-dark-pink p-[3px] font-Inter"
              onClick={() => openModal()}
            >
              <div className="flex h-full items-center justify-center gap-[10px] rounded-[6px] bg-[#181620] px-4">
                <div>
                  <PlusOutlined />
                </div>
                <Typography>Wallet Connect</Typography>
              </div>
            </Button>
          )}
          {!hide && (
            <div className="h-[56px] min-w-[119px]">
              <OnSelect
                className="font-Poppins h-[56px] "
                imageHeight={24}
                imageSrc={logo}
                imageWidth={24}
                optionIMG={ADAdata}
                onSelect={handleSelectADA}
              />
            </div>
          )}
          {session.status === 'authenticated' || hasToken ? (
            <Button className="" onClick={handleSignOut}>
              {userData.profilePic && userData.profilePic !== '' ? (
                <div className="h-[50px] w-[50px]">
                  <Image
                    alt="Avatar"
                    className="inline-block h-[50px] w-[50px] rounded-full ring-2 ring-whiteE8 "
                    height={50}
                    src={userData.profilePic}
                    width={50}
                  />
                </div>
              ) : (
                <div className="h-[40px] w-[40px] md:!h-[54px] md:!w-[54px]">
                  <PersonAvtar height={'64px'} width={'64px'} />
                </div>
              )}
            </Button>
          ) : (
            <Button
              className="font-Poppins h-[52px] w-[126px] rounded bg-button-gradient"
              onClick={() => router.push('/login')}
              // onClick={connectWallet}
              //   onClick={() => connect(
              //     'Nova',
              //     onConnect
              // )}
              // onClick={() => enableWallet()}
              // onClick={() => handleClickUSB()}
            >
              Log In
            </Button>
          )}
        </div>
        <WalletSignUp setShow={setModalOpen} showModal={modalOpen} />
      </div>
    </div>
  )
}

export default Header
