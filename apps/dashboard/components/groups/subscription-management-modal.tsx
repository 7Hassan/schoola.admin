'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@workspace/ui/components/ui/dialog'
import { Button } from '@workspace/ui/components/ui/button'
import { Input } from '@workspace/ui/components/ui/input'
import { Label } from '@workspace/ui/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@workspace/ui/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/ui/card'
import { Badge } from '@workspace/ui/components/ui/badge'
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  BookOpen,
  AlertCircle,
  Loader2
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@workspace/ui/components/ui/alert-dialog'
import { toast } from '@workspace/ui/hooks/use-toast'
import {
  useGroupsStore,
  Subscription,
  SubscriptionType,
  Currency
} from '@/stores/groups-store'

// Validation schema for subscription form
const subscriptionSchema = z.object({
  type: z.enum(['monthly', 'level'] as const),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  currency: z.enum(['egp', 'usd'] as const),
  numberOfLecturesIncluded: z.number().min(1, 'Must include at least 1 lecture')
})

type SubscriptionFormData = z.infer<typeof subscriptionSchema>

interface SubscriptionManagementModalProps {
  groupId: string
  groupName: string
  totalLectures: number
  children: React.ReactNode
}

export function SubscriptionManagementModal({
  groupId,
  groupName,
  totalLectures,
  children
}: SubscriptionManagementModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getGroupSubscriptions,
    hasSubscriptionType
  } = useGroupsStore()

  const subscriptions = getGroupSubscriptions(groupId)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      type: 'monthly',
      amount: 0,
      currency: 'egp',
      numberOfLecturesIncluded: 1
    }
  })

  const watchedType = watch('type')

  const handleCreateSubscription = () => {
    setIsEditing(false)
    setEditingSubscription(null)
    reset({
      type: 'monthly',
      amount: 0,
      currency: 'egp',
      numberOfLecturesIncluded: 1
    })
  }

  const handleEditSubscription = (subscription: Subscription) => {
    setIsEditing(true)
    setEditingSubscription(subscription)
    setValue('type', subscription.type)
    setValue('amount', subscription.cost.amount)
    setValue('currency', subscription.cost.currency)
    setValue('numberOfLecturesIncluded', subscription.numberOfLecturesIncluded)
  }

  const onSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true)

    try {
      // Check if type already exists (only for create, not edit)
      if (!isEditing && hasSubscriptionType(groupId, data.type)) {
        toast({
          title: 'Subscription type already exists',
          description: `This group already has a ${data.type} subscription. You can only have one subscription of each type.`,
          variant: 'destructive'
        })
        return
      }

      const subscriptionData = {
        type: data.type,
        cost: {
          amount: data.amount,
          currency: data.currency
        },
        numberOfLecturesIncluded: data.numberOfLecturesIncluded
      }

      if (isEditing && editingSubscription) {
        // Update existing subscription
        updateSubscription(groupId, editingSubscription.id, subscriptionData)
        toast({
          title: 'Subscription updated',
          description: `${data.type} subscription has been updated successfully.`
        })
      } else {
        // Create new subscription
        addSubscription(groupId, subscriptionData)
        toast({
          title: 'Subscription created',
          description: `${data.type} subscription has been created successfully.`
        })
      }

      // Reset form and close modal
      reset()
      setIsEditing(false)
      setEditingSubscription(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSubscription = (
    subscriptionId: string,
    type: SubscriptionType
  ) => {
    deleteSubscription(groupId, subscriptionId)
    toast({
      title: 'Subscription deleted',
      description: `${type} subscription has been deleted successfully.`
    })
  }

  const getAvailableTypes = (): SubscriptionType[] => {
    const allTypes: SubscriptionType[] = ['monthly', 'level']
    if (isEditing && editingSubscription) {
      // When editing, allow current type
      return allTypes
    }
    // When creating, only show types that don't exist yet
    return allTypes.filter((type) => !hasSubscriptionType(groupId, type))
  }

  const getSubscriptionTypeColor = (type: SubscriptionType) => {
    switch (type) {
      case 'monthly':
        return 'bg-blue-100 text-blue-800'
      case 'level':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Subscriptions</DialogTitle>
          <DialogDescription>
            Manage subscription options for "{groupName}". You can have one
            monthly and one level subscription.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Subscriptions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current Subscriptions</h3>
              {subscriptions.length < 2 && (
                <Button
                  onClick={handleCreateSubscription}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subscription
                </Button>
              )}
            </div>

            {subscriptions.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      No subscriptions configured
                    </p>
                    <Button
                      onClick={handleCreateSubscription}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {subscriptions.map((subscription) => (
                  <Card key={subscription.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge
                          className={getSubscriptionTypeColor(
                            subscription.type
                          )}
                        >
                          {subscription.type}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditSubscription(subscription)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Subscription
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this{' '}
                                  {subscription.type} subscription? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteSubscription(
                                      subscription.id,
                                      subscription.type
                                    )
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">
                          {subscription.cost.amount}{' '}
                          {subscription.cost.currency.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Includes {subscription.numberOfLecturesIncluded}{' '}
                          lectures
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Subscription Form */}
          {(getAvailableTypes().length > 0 || isEditing) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditing ? 'Edit Subscription' : 'Create New Subscription'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Subscription Type *</Label>
                      <Select
                        value={watchedType}
                        onValueChange={(value: SubscriptionType) =>
                          setValue('type', value)
                        }
                        disabled={isEditing} // Don't allow changing type when editing
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableTypes().map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency *</Label>
                      <Select
                        value={watch('currency')}
                        onValueChange={(value: Currency) =>
                          setValue('currency', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="egp">EGP</SelectItem>
                          <SelectItem value="usd">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        step="0.01"
                        {...register('amount', { valueAsNumber: true })}
                        className={errors.amount ? 'border-red-500' : ''}
                      />
                      {errors.amount && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.amount.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numberOfLecturesIncluded">
                        Lectures Included *
                      </Label>
                      <Input
                        id="numberOfLecturesIncluded"
                        type="number"
                        min="1"
                        max={totalLectures}
                        {...register('numberOfLecturesIncluded', {
                          valueAsNumber: true
                        })}
                        className={
                          errors.numberOfLecturesIncluded
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      {errors.numberOfLecturesIncluded && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.numberOfLecturesIncluded.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Max: {totalLectures} (total lectures in group)
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        reset()
                        setIsEditing(false)
                        setEditingSubscription(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isEditing
                        ? 'Update Subscription'
                        : 'Create Subscription'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Limits Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900">
                    Subscription Limits
                  </p>
                  <p className="text-sm text-blue-700">
                    Each group can have a maximum of one monthly subscription
                    and one level subscription. You cannot create duplicate
                    subscription types.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

