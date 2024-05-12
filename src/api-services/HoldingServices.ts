/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CoreAPIService from './CoreAPIService'

import { AssetsDetailsBlock } from 'design-systems/Templates/HoldingPageTemplate/interface'
import { API_ENDPOINTS } from 'utils/api-integration'
class HoldingServices {
  getHolding = async (data: {}) => {
    // return CoreAPIService.get<any>(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PUBLIC.GET_HOLDING}`)
    // return CoreAPIService.get<any>(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PUBLIC.GET_HOLDING_ASSETS}`)
    return CoreAPIService.post<any>(
      `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PUBLIC.GET_HOLDING_COLLECTION}`,
      data
    )
  }
  postAssetDetails = async (AssetsDetails: AssetsDetailsBlock) => {
    return CoreAPIService.post<any>(
      `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PUBLIC.POST_ASSETS_DETAILS}`,
      AssetsDetails
    )
  }
  getPortFolio = async () => {
    return CoreAPIService.get<any>(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PUBLIC.GET_PORTFOLIO}`)
  }
  getIncome = async (data: object) => {
    return CoreAPIService.post<NFTData>(
      `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PUBLIC.GET_PORTFOLIO_V2}`,
      data
    )
  }
  getWalletList = async () => {
    // return CoreAPIService.get<any>(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PUBLIC.GET_INCOME}`)
    return CoreAPIService.get<any>(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PRIVATE.LIST}`)
  }
  getUserPortfolio = async () => {
    return CoreAPIService.get<any>(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PRIVATE.GET_USER_PORFOLIO}`)
  }
  getHoldingsAndGrains = async () => {
    return CoreAPIService.get<any>(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PRIVATE.GET_HOLDING_AND_GRAIN}`)
  }
  getholdingGraph = async () => {
    return CoreAPIService.get<any>(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.PRIVATE.GET_HOLDING_GRAPH}`)
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new HoldingServices()
