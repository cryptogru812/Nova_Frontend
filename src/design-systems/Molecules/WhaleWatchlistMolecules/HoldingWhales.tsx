/* eslint-disable @typescript-eslint/no-explicit-any */
import { RxCaretSort } from 'react-icons/rx'
import { FiInfo } from 'react-icons/fi'

import Graph from '../Graph'
import TableProps from '../IndexTable/interface'

import { Graphdata } from 'design-systems/Templates/MarketAnaliticsTemplate/utils'
import { BookMarkEmpty, BookMarkFill, SpaceCraftIcons } from 'design-systems/Atoms/Icons'
import Typography from 'design-systems/Atoms/Typography'

const HoldingWhales: React.FC<TableProps> = ({ data, headData }) => {
  return (
    <div className="box-content h-full w-full overflow-auto pe-[12px]">
      <table className="rounded-corners h-full w-full font-Lexend">
        <thead>
          <tr>
            {headData?.map((item: any, key: number) => (
              <th key={key}>
                <div className={`flex items-center ${key === 0 ? 'justify-start' : 'justify-center'} !w-full gap-2`}>
                  {key === 0 && (
                    <span className="mr-[94px]">
                      <BookMarkEmpty />
                    </span>
                  )}
                  {item.isInfo && <FiInfo className="text-md" />}

                  <Typography className={`line-clamp-2 overflow-hidden text-ellipsis`} size="md">
                    {item.name}
                  </Typography>

                  {item.isSort && <RxCaretSort className="text-md" />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, key: number) => (
            <tr key={key}>
              {/* <td>
                <BookMarkFill />
              </td> */}
              <td>
                <div className="flex items-center gap-4">
                  <BookMarkFill />
                  <Typography>{key + 1}</Typography>
                  <SpaceCraftIcons />
                  <Typography>{item.wallet}</Typography>
                </div>
              </td>
              <td className=" !max-w-[120px]">
                <div className="!w-full">
                  <Graph
                    data={Graphdata}
                    height={31}
                    hideXAxis={true}
                    lineColor="#17D178"
                    lineWidth={2}
                    width="100%"
                    xKey="month"
                    yKey="value"
                  />
                </div>
              </td>
              <td>{item.floor}</td>
              <td>{item.buyVolume}</td>
              <td>{item.fees}</td>
              <td>{item.floor}</td>
              <td>{item.unrealizedGains}</td>
              <td>{item.volume}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="transparent-footer-bg">
          <tr>
            <td colSpan={headData.length || 0}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default HoldingWhales
