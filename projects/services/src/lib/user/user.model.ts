import { ContractCertificateModel } from '@services/contract/contract.model';

export interface UserModel {
  address: string
  seed: string
  certificates: ContractCertificateModel[]
}
