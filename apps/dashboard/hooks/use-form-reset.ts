'use client'

import { useCallback } from 'react'
import { UseFormReset, FieldValues } from 'react-hook-form'

interface UseFormResetOptions<T extends FieldValues> {
  reset: UseFormReset<T>
  defaultValues: T
  onReset?: () => void
}

export function useFormReset<T extends FieldValues>({
  reset,
  defaultValues,
  onReset
}: UseFormResetOptions<T>) {
  const handleReset = useCallback(() => {
    reset(defaultValues)
    onReset?.()
  }, [reset, defaultValues, onReset])

  return {
    handleReset
  }
}

