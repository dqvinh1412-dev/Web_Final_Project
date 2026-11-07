import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export interface PasswordRuleEvaluation {
  minLength: boolean
  hasLetter: boolean
  hasNumber: boolean
  isValid: boolean
}

export function evaluatePasswordRules(password: string): PasswordRuleEvaluation {
  const minLength = password.length >= 8
  const hasLetter = /[A-Za-z]/.test(password)
  const hasNumber = /\d/.test(password)
  return {
    minLength,
    hasLetter,
    hasNumber,
    isValid: minLength && hasLetter && hasNumber,
  }
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
