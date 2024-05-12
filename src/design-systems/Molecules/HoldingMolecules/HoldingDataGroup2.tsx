/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { TETooltip } from 'tw-elements-react'

import Web3Modal from '../../../context/WagmiModalProvider'
import ExchangeModal from '../ModalMolecules/ExchnageModal'
import WalletSignUp from '../ModalMolecules/WalletSignUp'
import { TableSkeletan } from '../Skeletan/TableSkeletan'

import { ExchangeSettingType } from './interface'

import Button from 'design-systems/Atoms/Button'
import { Checkbox } from 'design-systems/Atoms/CheckBox'
import { EditIcons, PlusOutlined } from 'design-systems/Atoms/Icons'
import Typography from 'design-systems/Atoms/Typography'
import { useHolding } from 'hooks/apis/useHolding'
import { walletData } from 'lib/redux/slices/walletSlice'
import { useDataSelector } from 'lib/redux/store'

const HoldingDataGroup2: React.FC = () => {
  const { walletConnect } = useHolding()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [walletList, setWalletList] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [showExchangeWallet, setShowExchangeWallet] = useState<boolean>(false)
  const { binance, coinbase } = useDataSelector('exchange')
  const { crypto } = useDataSelector('toggle')
  const dispatch = useDispatch()
  const { wallets } = useDataSelector('walletSlice')
  const [exchangeSetting, setExchangeSetting] = useState<ExchangeSettingType>({
    isBinance: binance.is_connected,
    isCoinbase: coinbase.is_connected,
    selectAll: binance.is_connected && coinbase.is_connected,
  })

  useMemo(() => {
    if (walletConnect) {
      setWalletList(walletConnect)
    }
  }, [walletConnect])
  const handleExchangeSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name

    if (name === 'selectAll') {
      setExchangeSetting(prev => ({
        ...prev,
        selectAll: !prev.selectAll,
        isCoinbase: e.target.checked,
        isBinance: e.target.checked,
      }))
    }

    if (name === 'isCoinbase') {
      setExchangeSetting(prev => ({
        ...prev,
        isCoinbase: !prev.isCoinbase,
        selectAll: false,
      }))
    }

    if (name === 'isBinance') {
      setExchangeSetting(prev => ({
        ...prev,
        isBinance: !prev.isBinance,
        selectAll: false,
      }))
    }
  }

  const grandTotal = useMemo(
    () =>
      (Array.isArray(coinbase.data)
        ? coinbase.data
            ?.filter(item => item.asset.includes('ADA'))
            .reduce((accm, curr) => {
              return accm + +curr.free
            }, 0)
        : undefined || 0) +
      (Array.isArray(binance.data)
        ? binance?.data
            ?.filter(item => item.asset.includes('ADA'))
            ?.reduce((accum, curr) => {
              return accum + parseInt(curr.free)
            }, 0)
        : undefined || 0),
    [coinbase, binance]
  )

  const openModal = () => {
    setModalOpen(true)
  }

  const handleWalletSettings = (e: React.ChangeEvent<HTMLInputElement>, item2: any) => {
    if (e.target.name === 'selectAll') {
      setLoading(true)

      // Handle "Select All" checkbox click
      const updatedWallets =
        walletList?.userWallets?.map((wallet: any) => ({
          walletName: wallet.name,
          walletAddress: wallet.walletAddress,
          isActive: e.target.checked,
        })) || []

      // Introduce a delay to simulate an asynchronous operation (replace this with your actual dispatch operation)
      setTimeout(() => {
        dispatch(walletData(updatedWallets))
        setLoading(false)
      }, 1000)
    } else {
      const updatedWallet = {
        walletName: item2?.name,
        walletAddress: item2?.walletAddress,
        isActive: e.target.checked,
      }

      const currentWallets = [...wallets]

      const index = currentWallets.findIndex((wallet: any) => wallet.walletName === item2.name)

      if (index !== -1) {
        // If the wallet is already in the state, update its isActive property
        currentWallets[index] = updatedWallet
      } else {
        // If the wallet is not in the state, add it
        currentWallets.push(updatedWallet)
      }

      dispatch(walletData(currentWallets))
    }
  }

  //   const handleSelectAll = () => {
  //     const updatedWallets = walletList?.userWallets?.map((item2: any) => ({
  //       ...item2,
  //     }))
  // console.log("updatedWallets", updatedWallets);

  //     dispatch(walletData(updatedWallets))
  //     setSelectAll(!selectAll)
  //   }
  const totalBalance =
    walletList?.userWallets &&
    walletList.userWallets.reduce((total: any, wallet: any) => total + parseFloat(wallet.balance), 0)

  const coinbaseTotal = useMemo(
    () =>
      Array.isArray(coinbase.data)
        ? coinbase.data
            ?.filter(item => item.asset.includes('ADA'))
            .reduce((accm, curr) => {
              return accm + +curr.free
            }, 0)
        : undefined,
    [coinbase.data]
  )

  const binanceTotal = useMemo(
    () =>
      Array.isArray(binance.data)
        ? binance.data
            ?.filter(item => item.asset.includes('ADA'))
            ?.reduce((accum, curr) => {
              return accum + parseInt(curr.free)
            }, 0)
        : undefined,
    [binance.data]
  )
  return (
    <Web3Modal>
      <div className="flex h-auto w-full flex-col flex-wrap content-between justify-between gap-[22px] !rounded-md bg-blackCardBg p-2 text-[#DBDBDB] md:!p-[22px] lg:col-span-2  ">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between font-Lexend">
            <Typography className="!font-medium" size="lg">
              Connected Exchanges:
            </Typography>
            <div className="rounded-[6px] bg-black225_05 p-1">
              <EditIcons />
            </div>
          </div>
          <div className="flex flex-col gap-4 font-Inter font-normal">
            <div className="flex w-full items-center justify-between">
              <div className="flex w-full items-center gap-2">
                <Checkbox
                  checked={exchangeSetting.selectAll}
                  disabled={coinbase.is_connected && binance.is_connected}
                  name="selectAll"
                  onChange={handleExchangeSettings}
                />
                <Typography>Select All</Typography>
              </div>

              <Typography className="w-full text-right text-grayDB" size="md">
                <TETooltip title={grandTotal}>
                  <>{grandTotal ? grandTotal.toFixed(2) + ` ${crypto.symbol}` : '--'} </>
                </TETooltip>
              </Typography>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex w-full items-center gap-2">
                <Checkbox
                  checked={exchangeSetting.isCoinbase}
                  disabled={coinbase.is_connected}
                  name="isCoinbase"
                  onChange={handleExchangeSettings}
                />
                <Typography>Coinbase</Typography>
              </div>

              <Typography className="w-full text-right text-grayDB" size="md">
                <TETooltip title={coinbaseTotal}>
                  <>{coinbaseTotal ? coinbaseTotal.toFixed(2) + ` ${crypto.symbol}` : '--'} </>
                </TETooltip>
              </Typography>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex w-full items-center gap-2">
                <Checkbox
                  checked={exchangeSetting.isBinance}
                  disabled={binance.is_connected}
                  name="isBinance"
                  onChange={handleExchangeSettings}
                />
                <Typography>Binance</Typography>
              </div>

              <Typography className="w-full text-right text-grayDB" size="md">
                <TETooltip title={binanceTotal}>
                  <>{binanceTotal ? binanceTotal.toFixed(2) + ` ${crypto.symbol}` : '--'} </>
                </TETooltip>
              </Typography>
            </div>
          </div>
          <div className="flex w-full justify-center">
            <Button
              className="flex w-full flex-row rounded-xs bg-gradint-dark-pink p-[2px]"
              disabled={!exchangeSetting.isBinance && !exchangeSetting.isCoinbase}
              onClick={() => {
                setShowExchangeWallet(true)
              }}
            >
              <div className="flex h-full w-full items-center justify-center gap-2  rounded-xs bg-bg25  px-8 py-3">
                <PlusOutlined />
                <Typography className="font-normal" size="md">
                  Connect Exchange
                </Typography>
              </div>
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between font-Lexend">
            <Typography className="!font-medium" size="lg">
              Connected Wallets:
            </Typography>
            <div className="rounded-[6px] bg-black225_05 p-1">
              <EditIcons />
            </div>
          </div>
          <div className="flex flex-col gap-4 font-Inter !font-normal">
            <div className="flex w-full items-center justify-between">
              <div className="flex w-full items-center gap-2">
                <Checkbox
                  checked={wallets.length > 0 && wallets.every(w => w.isActive)}
                  name="selectAll"
                  onChange={e => handleWalletSettings(e, null)}
                />
                <Typography>Select All</Typography>
              </div>

              <Typography className="w-full text-right text-grayDB" size="md">
                {totalBalance > 0 ? `${totalBalance} ${crypto.symbol}` : `--`}
              </Typography>
            </div>
            {loading === false ? (
              <>
                {walletList?.userWallets?.map((item2: any, key: number) => {
                  const address = `${item2?.walletAddress?.substring(0, 6)}...${item2.walletAddress?.slice(-6)}`
                  const isActive = wallets?.some(w => w.walletName === item2.name && w.isActive)
                  return (
                    <div className="flex justify-between" key={key}>
                      <div className="flex w-full items-start gap-2">
                        <Checkbox
                          defaultChecked={isActive}
                          onChange={e => {
                            handleWalletSettings(e, item2)
                          }}
                        />
                        <div className="text-left">
                          <Typography>{item2.name} Wallet</Typography>
                          <Typography className="text-[11px] font-medium">{address}</Typography>
                        </div>
                      </div>
                      <Typography className="w-full text-right text-grayDB" size="md">
                        {item2.balance} {crypto.symbol}
                      </Typography>
                    </div>
                  )
                })}
              </>
            ) : (
              <TableSkeletan limit={3} />
            )}

            {/* <div className="flex justify-between">
              <div className="flex w-full items-start gap-2">
                <input
                  className="relative float-left mt-1 h-[18px] w-[18px] appearance-none rounded-[0.25rem] border-[0.125rem] !border-[#7F8489] checked:!border-skyBlue checked:!bg-skyBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 hover:cursor-pointer"
                  type="checkbox"
                  value={''}
                />
                <div className="text-left">
                  <Typography>Eternl Wallet </Typography>
                  <Typography className="text-[11px] font-medium">$ADA-Handle</Typography>
                </div>
              </div>
              <Typography className="w-full text-right text-grayDB" size="md">
                10.000,65 {crypto.symbol}
              </Typography>
            </div>
            <div className="flex justify-between">
              <div className="flex w-full items-start gap-2">
                <input
                  className="relative float-left mt-1 h-[18px] w-[18px] appearance-none rounded-[0.25rem] border-[0.125rem] !border-[#7F8489] checked:!border-skyBlue checked:!bg-skyBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 hover:cursor-pointer"
                  type="checkbox"
                  value={''}
                />
                <div className="text-left">
                  <Typography>Deadalus</Typography>
                  <Typography className="text-[11px] font-medium">$ADA-Handle</Typography>
                </div>
              </div>
              <Typography className="w-full text-right text-grayDB" size="md">
                10.000,65 {crypto.symbol}
              </Typography>
            </div>
            <div className="flex justify-between">
              <div className="flex w-full items-start gap-2">
                <input
                  className="relative float-left mt-1 h-[18px] w-[18px] appearance-none rounded-[0.25rem] border-[0.125rem] !border-[#7F8489] checked:!border-skyBlue checked:!bg-skyBlue checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 hover:cursor-pointer"
                  type="checkbox"
                  value={''}
                />
                <div className="text-left">
                  <Typography>Deadalus</Typography>
                  <Typography className="text-[11px] font-medium">$ADA-Handle</Typography>
                </div>
              </div>
              <Typography className="w-full text-right text-grayDB" size="md">
                10.000,65 {crypto.symbol}
              </Typography>
            </div>
              </div>*/}
            <div className="flex w-full justify-center">
              <Button
                className=" flex w-full flex-row rounded-xs bg-gradint-dark-pink  p-[2px]"
                onClick={() => openModal()}
              >
                <div className="flex h-full w-full items-center justify-center gap-2  rounded-xs bg-bg25  px-8 py-3">
                  <PlusOutlined />
                  <Typography className="font-normal" size="md">
                    Connect Wallet
                  </Typography>
                </div>
              </Button>
            </div>
          </div>
          <WalletSignUp setShow={setModalOpen} showModal={modalOpen} />
          <ExchangeModal
            exchangeSetting={exchangeSetting}
            setShow={() => setShowExchangeWallet(prev => !prev)}
            showModal={showExchangeWallet}
          />
        </div>
      </div>
    </Web3Modal>
  )
}

export default HoldingDataGroup2
