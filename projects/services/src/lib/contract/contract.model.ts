export type ContractRawDataKey = string
export type ContractRawDataValue = string
export type ContractRawDataTypeString = string
export type ContractRawDataTypeNumber = number

export type ContractRawDataEntityId = string

export interface ContractRawDataString {
  key: ContractRawDataKey
  value: ContractRawDataValue
  type: ContractRawDataTypeString
}

export interface ContractRawDataNumber {
  key: ContractRawDataKey
  value: ContractRawDataValue
  type: ContractRawDataTypeNumber
}

export type ContractRawData = ContractRawDataString[]

export interface ContractCertificateModel {
  id?: ContractRawDataEntityId
  status?: ContractRawDataString
  title?: ContractRawDataString
  description?: ContractRawDataString
  author?: ContractRawDataString
  company?: ContractRawDataString
  link?: ContractRawDataString
  app?: {[s: string]: ContractApplicationDataModel}
  applicants?: ContractRawDataString

  // voting?: {
  //   amount?: ContractRawDataNumber
  //   state?: ContractRawDataNumber
  // }
  // voted?: {[s: string]: ContractRawDataNumber}
}

export interface ContractApplicationDataModel {
  details: ContractRawDataString
  id: ContractRawDataString
  status: ContractRawDataString
}

export interface ContractDataModel {
  working: {
    members: ContractRawDataString
    member: {[s: string]: {
      weight: ContractRawDataString
    }}
    size: ContractRawDataNumber
  }
  dao: {
    member: {[s: string]: {
        weight: ContractRawDataString
      }},
    members: ContractRawDataString
    size: ContractRawDataNumber
  }
  template: {[s: string]: ContractCertificateModel}
}
