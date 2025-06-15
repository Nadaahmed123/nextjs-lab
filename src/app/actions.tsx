'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(['user', 'admin']).default('user')
})

export async function createUser(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries())
  
  try {
    const validatedData = userSchema.parse(rawData)
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create user')
    }
    
    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      }
    }
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}