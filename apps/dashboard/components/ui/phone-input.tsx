'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Input } from '@workspace/ui/components/ui/input'
import { Label } from '@workspace/ui/components/ui/label'
import { Button } from '@workspace/ui/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@workspace/ui/components/ui/popover'
import { Check, ChevronDown, Phone } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import {
  COUNTRY_CODES,
  CountryCode,
  validatePhoneNumber,
  formatPhoneNumber,
  getDefaultCountry,
  extractDigits,
  parsePhoneNumber
} from '@/utils/phone-utils'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  onValidationChange?: (isValid: boolean, formatted?: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  required?: boolean
  className?: string
  allowedCountries?: string[]
  defaultCountryCode?: string
  onCountryChange?: (countryCode: string) => void
}

export function PhoneInput({
  value = '',
  onChange,
  onValidationChange,
  placeholder = 'Enter phone number',
  disabled = false,
  error,
  required = false,
  className,
  allowedCountries,
  defaultCountryCode
}: PhoneInputProps) {
  const allowedList =
    allowedCountries && allowedCountries.length > 0
      ? COUNTRY_CODES.filter((c) => allowedCountries.includes(c.code))
      : COUNTRY_CODES

  const initialCountry = (() => {
    if (defaultCountryCode) {
      return allowedList.find((c) => c.code === defaultCountryCode) || getDefaultCountry()
    }
    return getDefaultCountry()
  })()

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(initialCountry)
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [validationError, setValidationError] = useState<string>()
  const lastValueRef = useRef<string>('')
  const isInitializedRef = useRef<boolean>(false)

  // Initialize from props - only run once or when value changes from external source
  useEffect(() => {
    if (value !== lastValueRef.current) {
      lastValueRef.current = value

      if (value && value.trim()) {
        const parsed = parsePhoneNumber(value)
        if (parsed.country && parsed.countryCode) {
          // Find the CountryCode object that matches the parsed country within allowed list
          const matchingCountry = allowedList.find(
            (c) =>
              c.dialCode === parsed.countryCode ||
              c.name.toLowerCase().includes(parsed.country!.toLowerCase())
          )
          if (matchingCountry) {
            setSelectedCountry(matchingCountry)
            // notify parent of initial country selection
            onCountryChange?.(matchingCountry.code)
          }
          setInputValue(parsed.nationalNumber || extractDigits(value))
        } else {
          setInputValue(extractDigits(value))
        }
      } else if (!isInitializedRef.current) {
        setInputValue('')
      }
      isInitializedRef.current = true
    }
  }, [value])

  // Stable callback for validation and formatting
  const validateAndFormat = useCallback(() => {
    if (inputValue) {
      const fullNumber = inputValue.startsWith(selectedCountry.dialCode)
        ? inputValue
        : `${selectedCountry.dialCode}${extractDigits(inputValue)}`

      const validation = validatePhoneNumber(fullNumber, selectedCountry)
      setValidationError(validation.error)

      const formattedValue =
        validation.isValid && validation.formatted
          ? validation.formatted
          : fullNumber

      // Only call onChange if the value actually changed
      if (formattedValue !== lastValueRef.current) {
        lastValueRef.current = formattedValue
        onChange(formattedValue)
        onValidationChange?.(validation.isValid, validation.formatted)
      }
    } else {
      setValidationError(undefined)
      if (lastValueRef.current !== '') {
        lastValueRef.current = ''
        onChange('')
        onValidationChange?.(false)
      }
    }
  }, [inputValue, selectedCountry, onChange, onValidationChange])

  // Validate and format when input or country changes
  useEffect(() => {
    validateAndFormat()
  }, [validateAndFormat])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputVal = e.target.value

      // Remove country code if user types it
      const dialCodeWithoutPlus = selectedCountry.dialCode.slice(1)
      if (inputVal.startsWith(selectedCountry.dialCode)) {
        inputVal = inputVal.slice(selectedCountry.dialCode.length)
      } else if (inputVal.startsWith(dialCodeWithoutPlus)) {
        inputVal = inputVal.slice(dialCodeWithoutPlus.length)
      } else if (inputVal.startsWith('+')) {
        inputVal = inputVal.slice(1)
        if (inputVal.startsWith(dialCodeWithoutPlus)) {
          inputVal = inputVal.slice(dialCodeWithoutPlus.length)
        }
      }

      // Only allow digits and basic formatting
      inputVal = inputVal.replace(/[^\d\s-]/g, '')

      setInputValue(inputVal)

      // Always trigger validation when user types (immediate validation)
      if (inputVal) {
        const fullNumber = inputVal.startsWith(selectedCountry.dialCode)
          ? inputVal
          : `${selectedCountry.dialCode}${extractDigits(inputVal)}`

        const validation = validatePhoneNumber(fullNumber, selectedCountry)
        setValidationError(validation.error)

        const formattedValue =
          validation.isValid && validation.formatted
            ? validation.formatted
            : fullNumber

        if (formattedValue !== lastValueRef.current) {
          lastValueRef.current = formattedValue
          onChange(formattedValue)
          onValidationChange?.(validation.isValid, validation.formatted)
        }
      } else {
        setValidationError(undefined)
        if (lastValueRef.current !== '') {
          lastValueRef.current = ''
          onChange('')
          onValidationChange?.(false)
        }
      }
    },
    [selectedCountry.dialCode, validateAndFormat]
  )

  const handleInputBlur = useCallback(() => {
    validateAndFormat()
  }, [validateAndFormat])

  const handleCountryChange = useCallback(
    (countryCode: string) => {
      const country = allowedList.find((c) => c.code === countryCode)
      if (country) {
        setSelectedCountry(country)
        setIsCountryOpen(false)
        onCountryChange?.(country.code)

        // Re-validate with new country
        if (inputValue) {
          const validation = validatePhoneNumber(inputValue, country)
          if (validation.isValid && validation.formatted) {
            onChange(validation.formatted)
            onValidationChange?.(true, validation.formatted)
          }
        }
      }
    },
    [inputValue, onChange, onValidationChange]
  )

  const displayError = error || validationError

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex space-x-2">
        {/* Country Selector */}
        <Popover
          open={isCountryOpen}
          onOpenChange={setIsCountryOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className="px-3 py-2 h-10 min-w-[80px] justify-between"
              type="button"
            >
              <span className="flex items-center space-x-1">
                <span>{selectedCountry.flag}</span>
                <span className="text-xs">{selectedCountry.dialCode}</span>
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] p-0"
            align="start"
          >
            <div className="max-h-[200px] overflow-auto">
              {allowedList.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className={cn(
                    'w-full px-3 py-2 text-left hover:bg-accent flex items-center justify-between',
                    selectedCountry.code === country.code && 'bg-accent'
                  )}
                  onClick={() => handleCountryChange(country.code)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{country.flag}</span>
                    <span className="text-sm">{country.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {country.dialCode}
                    </span>
                    {selectedCountry.code === country.code && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Phone Number Input */}
        <div className="flex-1">
          <Input
            type="tel"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder={(selectedCountry.format ?? selectedCountry.placeholder ?? '')
              .replace(/X/g, '0')
              .replace(selectedCountry.dialCode, '')
              .trim()}
            disabled={disabled}
            className={cn(
              displayError && 'border-red-500 focus-visible:ring-red-500'
            )}
          />
        </div>
      </div>

      {/* Format hint */}
      {!displayError && selectedCountry && (
        <p className="text-xs text-muted-foreground">
          Format: {selectedCountry.format ?? selectedCountry.placeholder}
        </p>
      )}

      {/* Error message */}
      {displayError && (
        <p className="text-sm text-red-500 flex items-center">
          <Phone className="h-4 w-4 mr-1" />
          {displayError}
        </p>
      )}

      {/* Current formatted value preview */}
      {inputValue && !displayError && (
        <p className="text-xs text-muted-foreground">
          Will be saved as: {selectedCountry.dialCode}{' '}
          {extractDigits(inputValue)}
        </p>
      )}
    </div>
  )
}

