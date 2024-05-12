/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AppBtc from '@ledgerhq/hw-app-btc'
import Eth from '@ledgerhq/hw-app-eth'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { IMGtextSkeleton } from '../Skeletan/IMGtextSkeleton'

import { IMG } from 'assets/images'
import closeIcon from 'assets/images/close.svg'
import Button from 'design-systems/Atoms/Button'
import { BackIcon, FolderIcon, PlusOutlinedBig } from 'design-systems/Atoms/Icons'
import InputAtom from 'design-systems/Atoms/Input/InputAtom'
import Line from 'design-systems/Atoms/Line'
import IconAtom from 'design-systems/Atoms/Logo'
import { Model } from 'design-systems/Atoms/Model'
import { ModelProps } from 'design-systems/Atoms/Model/interface'
import Typography from 'design-systems/Atoms/Typography'
import { DesktopSupportDataWalet, MobileSupportDataWalet } from 'design-systems/data/data'
import { useWallet } from 'hooks/apis/useWallet'
import { useDataSelector } from 'lib/redux/store'

export async function getLedgerAddress(path: string): Promise<string> {
  const transport = await TransportWebHID.create()
  const eth = new Eth(transport)

  const result = await eth.getAddress(path, false, true)
  const address = result.address

  await transport.close()
  return address
}

const WalletSignUp: React.FC<ModelProps> = ({ showModal, setShow }) => {
  const [ShowWallet, setShowWallet] = useState<boolean>(false)
  const [mannulvalue, setMannulValue] = useState('')
  const [API, setAPI] = useState<any>(null)
  const { postWalletConnect, postNonceWallet, postVerifySignature, isLoadingNounce, isLoadingVerify } = useWallet()
  const [ledgerAddress, setLedgerAddress] = useState<string | null>(null)

  // const fetchCardanoAddressInfo = async (address: string) => {
  //   try {
  //     const headers = {
  //       apiKey: 'ec478e4c-9037-47d6-8d4d-6c7be0858138',
  //     }
  //     // Make an HTTP request to the Cardano API or a third-party API
  //     const response = await axios.get(`https://api.cardanoscan.io/api/v1/address/${address}`, {
  //       headers,
  //     })
  //     console.log(response)
  //   } catch (error) {
  //     console.error('Error fetching Cardano address information:', error)
  //   }
  // }

  const fetchCardanoAddressInfo = async (address: string) => {
    try {
      // Specify your CardanoScan API key
      const apiKey = 'ec478e4c-9037-47d6-8d4d-6c7be0858138'

      // Specify the CardanoScan API endpoint
      const apiUrl = `https://api.cardanoscan.io/api/v1/rewardAccount?rewardAddress=${address}`

      // Specify headers, including the API key
      const headers = {
        apiKey: apiKey,
      }

      // Make an HTTP request to the CardanoScan API with Axios
      const response = await axios.get(apiUrl, { headers: headers })

      const walletAddress = response.data.rewardsStakeAddr
    } catch (error) {
      console.error('Error fetching Cardano address information:', error)
    }
  }

  const CardanoData = async (newAPI: any, item: any) => {
    try {
      if (newAPI) {
        const walletAddress = await newAPI.getUsedAddresses()
        const RewardAddresses = await newAPI.getRewardAddresses()
        const UnusedAddresses = Buffer.from(await newAPI.getChangeAddress(), 'hex').toString('hex')

        const NetworkId = await newAPI.getNetworkId()
        const balance = await newAPI.getBalance()
        const [firstWalletAddress] = walletAddress

        generateNonce(firstWalletAddress, newAPI, item)
        // const num = 'b7792f9b-9cc0-4bb4-a0ea-bf44ba77ebac'
        // const hexString = num.replace(/-/g, '').toLowerCase()
        // console.log('hexString', num)
        // try {
        //   const num2= Buffer.from(num).toString('hex')
        //   const token = await newAPI.signData(firstWalletAddress, num2)
        //   console.log('token', token)
        // } catch (error) {
        //   console.error('Error signing data:', error)
        // }

        const [firstRewardAddresses] = RewardAddresses
        // await fetchCardanoAddressInfo(firstRewardAddresses)

        const apiData = {
          walletAddress: firstWalletAddress,
          RewardAddresses,
          NetworkId,
          walletLabel: item,
          isEnabled: true,
        }
        setAPI(apiData)
        // LocalData(apiData)
      }
    } catch (error) {
      console.error('Error retrieving wallet data:', error)
      toast.error('Error retrieving wallet data', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const generateNonce = async (firstWalletAddress: string, newAPI: any, item: any) => {
    try {
      const { data, success, message } = await postNonceWallet({
        hexaAddress: firstWalletAddress,
        name: item,
      })

      if (success) {
        toast.success(message, { position: toast.POSITION.TOP_RIGHT })

        const hexNonce = Buffer.from(data.nonce).toString('hex')
        const token = await newAPI.signData(firstWalletAddress, hexNonce)

        if (token && data.nonce) {
          const resultVerify = await postVerifySignature({
            hexaAddress: firstWalletAddress,
            nonce: data.nonce,
          })

          toast.success(resultVerify.message, { position: toast.POSITION.TOP_RIGHT })

          if (resultVerify.success) {
            setShow(false)
          }
        }
      } else {
        toast.error(message, { position: toast.POSITION.TOP_RIGHT })
      }
    } catch (error) {
      console.error('Error generating nonce:', error)
      toast.error('An error occurred while generating nonce', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }
  const fetchLedgerAddress = async () => {
    try {
      const path = "m/44'/60'/0'/0/0" // Change the path based on your needs
      const address = await getLedgerAddress(path)
      if (address) {
        toast.info('Check console!!!', {
          position: toast.POSITION.TOP_RIGHT,
        })
        console.info('address', address)
      }
      setLedgerAddress(address)
    } catch (error: any) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      console.error('Error fetching Ledger address:', error?.message)
    }
  }
  // const LocalData = (apiData: any) => {
  //   localStorage.setItem('walletData', JSON.stringify(apiData))
  //   dispatch(walletConnect(apiData))
  // }
  // const handleWalletDetails = async () => {
  //   try {
  //     // Check if walletCreate has the necessary properties
  //     if (
  //       walletCreate &&
  //       walletCreate.id !== undefined &&
  //       walletCreate.userName !== undefined &&
  //       API.walletAddress !== undefined &&
  //       walletCreate
  //     ) {
  //       const result = await postWalletConnect({
  //         userId: walletCreate.id,
  //         shownName: walletCreate.userName,
  //         walletAddress: API.walletAddress,
  //         stakeAddress: API.RewardAddresses,
  //         walletVerified: false,
  //       })
  //       // Handle success
  //       if (result.success) {
  //         setShow(false)
  //         localStorage.setItem('walletLoading', JSON.stringify(true))
  //         toast.success(result.message, {
  //           position: toast.POSITION.TOP_RIGHT,
  //         })
  //       }
  //     } else {
  //       // Handle the case where required properties are missing
  //       toast.error('Required properties in Connect Wallet are missing', {
  //         position: toast.POSITION.TOP_RIGHT,
  //       })
  //       console.error('Required properties in Connect Wallet are missing')
  //     }
  //   } catch (error: any) {
  //     toast.error(error.response?.data?.message || 'An error occurred', {
  //       position: toast.POSITION.TOP_RIGHT,
  //     })
  //     console.error(error.response?.data?.message)
  //   }
  // }
  // useMemo(() => {
  //   if (LocalWallet !== null && LocalWalletLoading === null) {
  //     handleWalletDetails()
  //   }
  // }, [LocalWallet])

  const enableWallet = async (item: string) => {
    try {
      if (typeof window !== undefined && window !== null) {
        if (item === 'Eternl') {
          const newAPI = await window.cardano.eternl.enable()
          CardanoData(newAPI, item)
        }
        if (item === 'Nami') {
          const newAPI = await window.cardano.nami.enable()
          CardanoData(newAPI, item)
        }
        if (item === 'Flint') {
          const newAPI = await window.cardano.flint.enable()
          CardanoData(newAPI, item)
        }
        if (item === 'Yoroi') {
          const newAPI = await window.cardano.yoroi.enable()
          CardanoData(newAPI, item)
        }
        if (item === 'Typhon') {
          const newAPI = await window.cardano.typhon.enable()
          CardanoData(newAPI, item)
        }
        if (item === 'Lace') {
          const newAPI = await window.cardano.lace.enable()
          CardanoData(newAPI, item)
        }
        if (item === 'Exodus') {
          const newAPI = await window.cardano.exodus.enable()
          CardanoData(newAPI, item)
        }
        if (item === 'Nufi') {
          const newAPI = await window.cardano.nufi.enable()

          CardanoData(newAPI, item)
        }
        if (item === 'Ledger') {
          fetchLedgerAddress()
          // const transport: any = await TransportWebHID.create()

          // const appBtc = new AppBtc(transport)
          // const { bitcoinAddress } = await appBtc.getWalletPublicKey("44'/0'/0'/0/0", {
          //   verify: false,
          //   format: 'legacy',
          // })

          // await appBtc.getWalletPublicKey("44'/0'/0'/0/0", { format: 'legacy', verify: true })
        }
        if (item === 'Gero') {
          const newAPI = await window.cardano.gerowallet.enable()
          CardanoData(newAPI, item)
        }
        if (item === 'Begin') {
          const newAPI = await window.cardano.begin.enable()
          CardanoData(newAPI, item)
        }
        if (item === 'Vespr') {
          const newAPI = await window.cardano.vespr.enable()
          CardanoData(newAPI, item)
        }
        // toast.success('Wallet Connected', {
        //   position: toast.POSITION.TOP_RIGHT,
        // })
      }
    } catch (err: any) {
      console.error('err', err)

      toast.error('Wallet Error', {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  const handleClickUSB = async () => {
    try {
      const transport: any = await TransportWebHID.create()

      const appBtc = new AppBtc(transport)
      const { bitcoinAddress } = await appBtc.getWalletPublicKey("44'/0'/0'/0/0", { verify: false, format: 'legacy' })
      toast.success('Wallet enabled', {
        position: toast.POSITION.TOP_RIGHT,
      })

      await appBtc.getWalletPublicKey("44'/0'/0'/0/0", { format: 'legacy', verify: true })
    } catch (e: any) {
      toast.error(e, {
        position: toast.POSITION.TOP_RIGHT,
      })
    }
  }

  return (
    // Your Index modal content goes here
    <Model heading="Connect Wallet" setShow={setShow} showModal={showModal}>
      <div className="flex min-w-[457px] flex-col gap-4">
        <div className="max-h-[608px] w-full overflow-auto rounded-[10px]">
          {ShowWallet && (
            <Button
              className="mb-[12px] flex w-full cursor-pointer items-center gap-[16px] rounded-[10px] bg-black225_05 p-3 text-left"
              onClick={() => setShowWallet(!ShowWallet)}
            >
              <BackIcon />
              <Typography className="!font-medium" size="paragraph">
                Back To The Smart Connection
              </Typography>
            </Button>
          )}
          <Button
            className="flex w-full cursor-pointer items-center gap-[16px] rounded-[10px] bg-black225_05 p-3 text-left"
            onClick={() => setShowWallet(true)}
          >
            <FolderIcon />
            <Typography className="!font-medium" size="paragraph">
              Manually
            </Typography>
          </Button>
          {ShowWallet ? (
            <div className="mt-[12px] flex flex-col items-center justify-center gap-[12px] rounded-[10px] bg-black225_05 p-3">
              <Typography className="font-medium" size="lg">
                Enter your wallet address to connect
              </Typography>
              <InputAtom
                className="w-full rounded-xs  bg-black225_05 px-[22px] py-3"
                placeholder={'Enter...'}
                type="text"
                value={mannulvalue}
                onChange={e => setMannulValue(e.target.value)}
              />
              <Button className=" w-full rounded-[6px] bg-gradient-pink px-[3px] pb-[2px] pt-[3px]">
                <div className="  w-full  flex-row items-center justify-center gap-2 rounded-[6px] bg-gradient-pink p-[10px] font-Lexend">
                  <Typography size="md">Connect Wallet</Typography>
                </div>
              </Button>
            </div>
          ) : (
            <>
              <Line className="!my-3" />
              <Typography className="!font-medium" size="paragraph">
                Wallet Supporting Mobile
              </Typography>
              <div className="mt-3 flex flex-col gap-3">
                {MobileSupportDataWalet.map((item, key) => (
                  <Button
                    className="flex w-full cursor-pointer items-center gap-[16px] rounded-[10px] bg-black225_05 p-3 text-left"
                    key={key}
                    onClick={() => enableWallet(item.Label)}
                  >
                    {isLoadingNounce || isLoadingVerify ? (
                      <IMGtextSkeleton limit={3} />
                    ) : (
                      <>
                        <Image alt="IMG" height={50} src={item.img} width={50} />
                        <Typography className="!font-medium" size="paragraph">
                          {item.Label}
                        </Typography>
                      </>
                    )}
                  </Button>
                ))}
              </div>
              <Line className="!my-3" />
              <Typography className="!font-medium" size="paragraph">
                Desktop Only
              </Typography>
              <div className="mt-3 flex flex-col gap-3">
                {DesktopSupportDataWalet.map((item, key) => (
                  <>
                    {/* {wallet.isEnabled && wallet.walletLabel !== item.Label && ( */}
                    <Button
                      className="flex w-full cursor-pointer items-center gap-[16px] rounded-[10px] bg-black225_05 p-3 text-left"
                      key={key}
                      onClick={() => enableWallet(item.Label)}
                    >
                      {isLoadingNounce || isLoadingVerify ? (
                        <IMGtextSkeleton limit={3} />
                      ) : (
                        <>
                          <Image alt="IMG" height={50} src={item.img} width={50} />
                          <Typography className="!font-medium" size="paragraph">
                            {item.Label}
                          </Typography>
                        </>
                      )}
                    </Button>
                    {/* )} */}
                  </>
                ))}
              </div>
              <Line className="!my-3" />
              <Typography className="!font-medium" size="paragraph">
                {`USB Connect (Hardware Wallet)`}
              </Typography>
              <div className="mt-3 flex flex-col gap-3">
                <Button
                  className="flex w-full cursor-pointer items-center gap-[16px] rounded-[10px] bg-black225_05 p-3 text-left"
                  onClick={() => enableWallet('Ledger')}
                >
                  {isLoadingNounce || isLoadingVerify ? (
                    <IMGtextSkeleton limit={3} />
                  ) : (
                    <>
                      <Image alt="IMG" height={50} src={IMG.legand} width={50} />
                      <Typography className="!font-medium" size="paragraph">
                        Ledger
                      </Typography>
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
        {/* <div className="flex flex-col gap-4">
          {WalletLoginData.map((item, key) => (
            <Button
              className="flex cursor-pointer items-center gap-3 rounded-[10px] bg-black225_05 p-3 text-left"
              key={key}
              onClick={() => enableWallet(item.Label)}
            >
              <div className="rounded-full bg-black225_05 p-3">
                <Image alt="IMGlogo" height={30} src={item.img} width={30} />
              </div>
              <Typography className="font-medium" size="subtitle">
                {item.Label}
              </Typography>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Line />
          <Typography>Or</Typography>
          <Line />
        </div>
        <Button className="w-full rounded bg-button-gradient p-4 font-medium">
          <Typography size="subtitle">Add Manual Wallet</Typography>
        </Button> */}
      </div>
    </Model>
  )
}

export default WalletSignUp
