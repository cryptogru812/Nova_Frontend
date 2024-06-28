/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// DataTable.tsx
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react' // Import the props interface
import { TECollapse } from 'tw-elements-react'
import { FiInfo } from 'react-icons/fi'
import { RxCaretSort } from 'react-icons/rx'

import TableProps from '../IndexTable/interface'
import BookMarkButton from '../Table/BookMarkButton'

import { LinkIcon, RightArrowIcons } from 'design-systems/Atoms/Icons'
import Typography from 'design-systems/Atoms/Typography'
import { Checkbox } from 'design-systems/Atoms/CheckBox'
import { IMG } from 'assets/images'

const HoldingAnalyticsTable: React.FC<TableProps> = ({ crypto, data, headData, loading }) => {
  const [activeElement, setActiveElement] = useState<string>('')
  const [checkboxes, setCheckboxes] = useState<any>([])

  const SEI = crypto?.value || 0
  const baseValue = 100

  const handleClick = (value: string) => {
    if (value === activeElement) {
      setActiveElement('')
    } else {
      setActiveElement(value)
    }
  }

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((item: any) => item.id)
      setCheckboxes(allIds)
    } else {
      setCheckboxes([])
    }
  }

  const handleCheckboxChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCheckboxes: any = [...checkboxes]

    const index = updatedCheckboxes.indexOf(id)

    if (index !== -1) {
      updatedCheckboxes.splice(index, 1)
    } else {
      updatedCheckboxes.push(id)
    }

    setCheckboxes(updatedCheckboxes)
  }

  return (
    <>
      <table className="rounded-corners w-full rounded-sm font-Lexend">
        <thead>
          <tr>
            {headData?.map((item: any, key: number) => {
              return (
                <th key={key} style={{ width: item.width }}>
                  <div className={`flex !w-full items-center gap-2 ${key === 0 ? 'justify-start' : 'justify-center'}`}>
                    {key === 0 && (
                      <Typography className="ml-4 mr-16">
                        <BookMarkButton isActive={true} />
                      </Typography>
                    )}
                    {item.isInfo && <FiInfo className="text-md" />}

                    <Typography className={`line-clamp-2 overflow-hidden text-ellipsis`} size="md">
                      {item.name}
                    </Typography>

                    {item.isSort && <RxCaretSort className="text-md" />}
                  </div>
                </th>
              )
            })}
            <th style={{ width: '70px' }}>
              <div className="flex !w-full justify-end">
                <div className="!flex items-center !justify-end gap-2">
                  <Typography className={`line-clamp-2 overflow-hidden text-ellipsis`} size="md">
                    All
                  </Typography>
                  <Checkbox
                    checked={checkboxes?.length === data?.length}
                    name="All"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAllChange(e.target.checked)}
                  />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            data?.map((collection: any, index: any) => {
              const info =
                collection?.userHoldingNfts &&
                collection?.userHoldingNfts?.reduce((acc: any, nft: any) => {
                  acc.rank = (acc.rank || 0) + nft?.rarity?.rank || 0
                  acc.buyPrice = (acc.buyPrice || 0) + nft?.buyPrice?.amount / SEI || 0
                  acc.estFee = (acc.estFee || 0) + nft?.estFee?.amount / SEI || 0
                  acc.unrealizedGains = (acc.unrealizedGains || 0) + nft?.unrealizedGains?.amount / SEI || 0
                  acc.holdingTime = (acc.holdingTime || 0) + nft?.holdingTime || 0
                  return acc
                }, {})
              info.rank = info.rank / collection?.userHoldingNfts?.length || 0

              const SinceTrade = collection?.sinceTrade / SEI

              const percentageChange = (SinceTrade - baseValue) / baseValue
              const formattedPercentageChange = `${
                (percentageChange >= 0 ? '+' : '') +
                percentageChange
                  .toFixed(2)
                  .replace('.', ',')
                  .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
              }%`
              return (
                <React.Fragment key={index}>
                  <tr className="cursor-pointer">
                    <td className="min-w-[230px]">
                      <div className="flex items-center justify-center gap-2">
                        <BookMarkButton isActive={false} />
                        <div className={`${activeElement === index && 'rotate-90'}`} onClick={() => handleClick(index)}>
                          <RightArrowIcons />
                        </div>
                        <div className="flex items-center justify-center gap-[3px]">
                          {collection?.pfp && collection?.pfp !== null ? (
                            <Image
                              alt={'IMG'}
                              className="rounded-[4px] rounded-ee-[10px] rounded-ss-[10px]"
                              height={40}
                              src={collection?.pfp}
                              width={40}
                            />
                          ) : (
                            <Image
                              alt={'IMG'}
                              className="rounded-[4px] rounded-ee-[10px] rounded-ss-[10px]"
                              height={48}
                              src={IMG.webump}
                              width={48}
                            />
                          )}
                          {collection?.name && collection?.name !== null ? collection?.name || '--' : '--'}
                        </div>
                      </div>
                    </td>
                    <td className="!w-[20px] !overflow-hidden !overflow-ellipsis">
                      {collection?.userHoldingAmount && collection?.userHoldingAmount !== null
                        ? collection?.userHoldingAmount
                        : '--'}
                    </td>
                    <td className="w-[40px] overflow-hidden overflow-ellipsis">
                      {collection?.weight !== undefined && collection?.weight !== null
                        ? `${collection?.weight?.toFixed(2)}%`
                        : '--'}
                    </td>
                    <td className="w-[100px] overflow-hidden overflow-ellipsis">
                      {collection?.floor !== undefined && collection?.floor !== null
                        ? `${Number(collection.floor)?.toFixed(2)} ${crypto?.symbol}`
                        : '--'}
                    </td>
                    <td>{info?.rank && info?.rank !== null ? info?.rank : '--'}</td>
                    {/* <td className="w-[100px] overflow-hidden overflow-ellipsis">{item.token}</td> */}
                    <td>{info.buyPrice ? `${Number(info.buyPrice)?.toFixed(2)} ${crypto?.symbol}` : '--'}</td>
                    <td>
                      {info?.estFee && info?.estFee !== null
                        ? `${Number(info.estFee)?.toFixed(2)} ${crypto?.symbol}`
                        : '--'}
                    </td>
                    <td>
                      {collection?.floor && collection?.floor !== null
                        ? `${Number(collection.floor * collection.userHoldingAmount)?.toFixed(2)} ${crypto?.symbol}`
                        : '--'}
                    </td>
                    <td>
                      {info?.unrealizedGains && info?.unrealizedGains !== null
                        ? `${Number(info.unrealizedGains).toFixed(2)} ${crypto?.symbol}`
                        : '--'}
                    </td>
                    <td className={` ${percentageChange < 0 ? 'text-warning-300' : 'text-green'}`}>
                      {collection?.sinceTrade && collection?.sinceTrade !== null
                        ? `${formattedPercentageChange}`
                        : '--'}
                    </td>
                    <td className="">
                      {collection && collection?.holdingTime !== null
                        ? collection?.holdingTime
                          ? `${collection?.holdingTime} d`
                          : '--'
                        : '--'}
                    </td>
                    <td>
                      {collection?.link && collection?.link !== null ? (
                        <Link
                          className="flex flex-col items-center justify-center"
                          href={collection && collection?.link}
                          target={`${
                            collection ? (collection?.link !== '' && collection?.link !== null ? '_blank' : '') : ''
                          }`}
                        >
                          <div className="rounded-[8px] bg-black225_05 p-1">
                            <LinkIcon />
                          </div>
                        </Link>
                      ) : (
                        '--'
                      )}
                    </td>
                    <td>
                      <div
                        className="flex !w-full justify-end"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleCheckboxChange(collection?.seiAddress, e)
                        }
                      >
                        <Checkbox checked={checkboxes.includes(collection?.seiAddress)} />
                      </div>{' '}
                    </td>
                  </tr>
                  {collection?.userHoldingNfts &&
                    collection?.userHoldingNfts?.map((nft: any) => (
                      <tr
                        className={`${activeElement === index ? 'table-row' : 'hidden'} cursor-pointer`}
                        key={nft.key}
                      >
                        <td className="!p-0">
                          <div>
                            <div className="flex w-full items-center">
                              <div className="w-[100px] !pl-0 text-center text-[14px] text-black7f">
                                {nft?.status?.status}
                              </div>
                              <div className="w-[40px] !px-0">
                                <Image alt={'IMG'} height={40} src={nft?.imageLink} width={40} />
                              </div>
                              <div className="w-[90px] !px-0 text-center">{nft?.name}</div>
                            </div>
                          </div>
                        </td>
                        <td></td>
                        <td></td>
                        <td className="overflow-hidden overflow-ellipsis">
                          <div>
                            {nft?.floor !== undefined && nft?.floor !== null
                              ? `${Number(nft.floor)?.toFixed(2)} ${crypto?.symbol}`
                              : '--'}
                          </div>
                        </td>
                        <td>{nft?.rarity?.rank && nft?.rarity?.rank !== null ? nft?.rarity?.rank : '--'}</td>
                        <td>
                          <div>
                            {nft?.buyPrice?.amount
                              ? `${Number(nft?.buyPrice?.amount / SEI)?.toFixed(2)} ${crypto?.symbol}`
                              : '--'}
                          </div>
                        </td>
                        <td>
                          <div>
                            {nft?.estFee && nft?.estFee !== null
                              ? `${Number(nft?.estFee.amount / SEI)?.toFixed(2)} ${crypto?.symbol}`
                              : '--'}
                          </div>
                        </td>
                        <td className="w-[100px] overflow-hidden overflow-ellipsis">
                          <div>
                            {nft?.floor && nft?.floor !== null
                              ? `${Number(nft.floor)?.toFixed(2)} ${crypto?.symbol}`
                              : '--'}
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-[4px]">
                            <div>
                              <Typography>
                                {nft?.unrealizedGains && nft?.unrealizedGains !== null
                                  ? `${Number(nft?.unrealizedGains.amount / SEI).toFixed(2)} ${crypto?.symbol}`
                                  : '--'}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={percentageChange < 0 ? 'text-warning-300' : 'text-green'}>
                          <Typography>
                            {collection?.sinceTrade && collection?.sinceTrade !== null
                              ? `${formattedPercentageChange}`
                              : '--'}
                          </Typography>
                        </td>
                        <td>
                          {collection && collection?.holdingTime !== null
                            ? collection?.holdingTime
                              ? `${collection?.holdingTime} d`
                              : '--'
                            : '--'}
                        </td>
                        <td>
                          {collection?.link && collection?.link !== null ? (
                            <Link
                              className="flex flex-col items-center justify-center"
                              href={collection && collection?.link}
                              target={`${
                                collection ? (collection?.link !== '' && collection?.link !== null ? '_blank' : '') : ''
                              }`}
                            >
                              <div className="rounded-[8px] bg-black225_05 p-1">
                                <LinkIcon />
                              </div>
                            </Link>
                          ) : (
                            '--'
                          )}
                        </td>
                        <td>
                          <div
                            className="flex !w-full justify-end"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleCheckboxChange(collection?.seiAddress, e)
                            }
                          >
                            <Checkbox checked={checkboxes.includes(collection?.seiAddress)} />
                          </div>{' '}
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              )
            })}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>Tokens: 4.000</td>
            <td>NFT: 4.000</td>
            <td>100%</td>
            <td></td>
            <td></td>
            <td>975.000 SEI</td>
            <td>975.000 SEI</td>
            <td>975.000 SEI</td>
            <td>975.000 SEI</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </>
  )
}

export default HoldingAnalyticsTable
