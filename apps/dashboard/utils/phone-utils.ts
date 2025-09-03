/**
 * Phone number utilities for validation and formatting
 * Supports Egypt (EG) and UAE (AE)
 */

export interface CountryCode {
  code: string
  name: string
  flag: string
  dialCode: string
  placeholder?: string
  format?: string
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', placeholder: '+20 10 1234 5678', format: '+20 XXX XXX XXXX' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', placeholder: '+971 50 123 4567', format: '+971 XX XXX XXXX' }
]

export function getDefaultCountry(): CountryCode {
  return COUNTRY_CODES.find((c) => c.code === 'EG') || COUNTRY_CODES[0]!
}

export function getPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '')
}

export function extractDigits(phone: string): string {
  return getPhoneDigits(phone)
}

// ✅ مصر: يقبل 010, 011, 012, 015 بعد ما نشيل +20 أو 0
const EGYPT_PATTERN = /^1(0|1|2|5)\d{8}$/
// ✅ الإمارات: يقبل 05xxxxxxxx أو +9715xxxxxxxx
const AE_PATTERN = /^5\d{8}$/

type ValidationResult = { isValid: boolean; country?: string; formatted?: string; error?: string }

export function validatePhoneNumber(phone: string, country?: string | CountryCode): ValidationResult {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Phone number is required' }
  }

  const digitsOnly = getPhoneDigits(phone)

  const tryFormat = (digits: string, code: 'EG' | 'AE'): ValidationResult => {
    if (code === 'EG') {
      const local = digits.replace(/^20/, '').replace(/^0/, '')
      if (EGYPT_PATTERN.test(local)) {
        const formatted = `+20 ${local.slice(0, 3)} ${local.slice(3, 7)} ${local.slice(7)}`
        return { isValid: true, country: 'EG', formatted }
      }
    }
    if (code === 'AE') {
      const local = digits.replace(/^971/, '').replace(/^0/, '')
      if (AE_PATTERN.test(local)) {
        const formatted = `+971 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`
        return { isValid: true, country: 'AE', formatted }
      }
    }
    return { isValid: false }
  }

  if (country) {
    const code = typeof country === 'string' ? country : country.code
    const result = tryFormat(digitsOnly, code as 'EG' | 'AE')
    if (result.isValid) return result
    return { isValid: false, error: `Invalid phone number for ${code}` }
  }

  const egyptCheck = tryFormat(digitsOnly, 'EG')
  if (egyptCheck.isValid) return egyptCheck

  const aeCheck = tryFormat(digitsOnly, 'AE')
  if (aeCheck.isValid) return aeCheck

  const generic = /^\d{6,15}$/
  if (generic.test(digitsOnly)) {
    return { isValid: true, country: 'International', formatted: `+${digitsOnly}` }
  }

  return { isValid: false, error: 'Invalid phone number format for Egypt or UAE' }
}

export function formatPhoneNumber(phone: string): string {
  const v = validatePhoneNumber(phone)
  return v.formatted || phone
}

export function extractCountryCode(phone: string): string | null {
  const trimmed = phone.trim()
  if (trimmed.startsWith('+20')) return '+20'
  if (trimmed.startsWith('+971')) return '+971'
  const m = trimmed.match(/^\+(\d{1,4})/)
  return m ? `+${m[1]}` : null
}

export function parsePhoneNumber(phone: string) {
  const v = validatePhoneNumber(phone)
  if (!v.isValid) return { isValid: false }
  const countryCode = extractCountryCode(phone)
  const digits = getPhoneDigits(phone)
  let national = digits
  if (countryCode) {
    const codeDigits = getPhoneDigits(countryCode)
    if (national.startsWith(codeDigits)) national = national.slice(codeDigits.length)
  }
  return {
    isValid: true,
    countryCode: countryCode || undefined,
    nationalNumber: national,
    formatted: v.formatted,
    country: v.country
  }
}
