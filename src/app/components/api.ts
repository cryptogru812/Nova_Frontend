/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance } from 'axios'
import { useMutation, UseMutationResult } from 'react-query'

const baseURL = process.env.NEXT_PUBLIC_API_URL

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
})

interface AuthData {
  email: string
  password: string
  registerType: string
  // Add other necessary fields for registration, forgot password, etc.
}

interface RegistrationData extends AuthData {
  userName: string
  // Other fields specific to the registration process
}

interface Api {
  login: UseMutationResult<any, unknown, AuthData, unknown>
  register: UseMutationResult<any, unknown, RegistrationData, unknown>
  forgotPassword: UseMutationResult<any, unknown, { email: string }, unknown>
  resendOtp: UseMutationResult<any, unknown, { userId: string }, unknown>
  verifyEmail: UseMutationResult<any, unknown, any, unknown>
  signInAuth: UseMutationResult<any, unknown, any, unknown>
}

export const useApi = (): Api => {
  const login = useMutation((credentials: AuthData) => axiosInstance.post('/auth/login', credentials))
  const register = useMutation((userData: RegistrationData) => axiosInstance.post('/auth/register', userData))
  const forgotPassword = useMutation((email: { email: string }) => axiosInstance.post('/auth/forgot-password', email))
  const resendOtp = useMutation((userId: { userId: string }) => axiosInstance.post('/auth/resend-otp', userId))
  const verifyEmail = useMutation((verificationData: any) => axiosInstance.post('/auth/verify-email', verificationData))
  const signInAuth = useMutation((signInAuth: any) => axiosInstance.post('/auth/registerWithGoogle', signInAuth))

  return {
    login,
    register,
    forgotPassword,
    resendOtp,
    verifyEmail,
    signInAuth,
  }
}

export default useApi
