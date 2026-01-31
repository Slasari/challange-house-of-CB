"use server"

import { cookies } from 'next/headers'

export default async function decoderToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if(token){
    try {
      const payloadBase64 = token.split('.')[1]
      const decodedPayload = JSON.parse(atob(payloadBase64))
      const email = decodedPayload.email
      const userId = decodedPayload.user_metadata.sub
      return {email, userId}
    } catch (e) {
      return {error: e}
    }
  }
}