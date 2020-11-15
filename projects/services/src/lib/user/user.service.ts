import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '@services/user/user.model';
import { WINDOW } from '@services/window';
import { randomSeed, address } from '@waves/ts-lib-crypto';
import { ContractService } from '@services/contract/contract.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private seed = randomSeed();

  private user$: Observable<UserModel> = this.contractService.stream.pipe(
      map((contract) => {
        // Demo seed
        const seed = this.window.localStorage.getItem('seed') || this.seed;
        const addr = this.window.localStorage.getItem('address') || address(seed, 'T')

        const certificates = Object.keys(contract.template).filter((cert) => {
          const certificate = contract.template[cert];

          if (certificate?.status?.value !== 'accepted') {
            return false
          }

          return certificate?.applicants?.value && certificate?.applicants?.value.indexOf(';' + addr) >= 0;
        }).map((key) => contract.template[key]?.title?.value).map((certName) => {
          if (certName === 'Certificate of Firefighter') {
            return 'fire'
          }
          if (certName === 'Police assistant') {
            return 'police'
          }
          if (certName === 'Emergency assistant') {
            return 'emergency'
          }
        })

        if (!this.window.localStorage.getItem('address')) {
          this.window.localStorage.setItem('address', addr);
        }

        if (!this.window.localStorage.getItem('seed')) {
          this.window.localStorage.setItem('seed', seed);
        }

        return {
          seed,
          address: addr,
          certificates
        }
      })
  )

  constructor (
      @Inject(WINDOW) public window: Window,
      private contractService: ContractService
  ) {}

  public get user () {
    return this.user$;
  }

}
