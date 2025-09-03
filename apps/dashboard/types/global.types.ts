export enum EmploymentType {
  FullTime = 'full_time',
  PartTime = 'part_time',
  Contract = 'contract'
}

export enum Gender {
  Male = 'male',
  Female = 'female'
}

export enum Currency {
  EGP = 'egp',
  USD = 'usd'
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
}

export interface Salary {
  amount: number
  currency: Currency
}

