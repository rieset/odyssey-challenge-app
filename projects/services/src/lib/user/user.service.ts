import {Inject, Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {UserModel} from '@services/user/user.model';
import {WINDOW} from '@services/window';
import { randomSeed, address } from '@waves/ts-lib-crypto';
import {ContractService} from '@services/contract/contract.service';
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

        console.log('ADDR', addr);

        const certificates = Object.keys(contract.template).filter((cert) => {
          const certificate = contract.template[cert];

          console.log('ADDR', cert);
          if (certificate?.status?.value !== 'accepted') {
            return false
          }

          if(certificate.app && Object.keys(certificate.app).find((applicationKey) => {
            console.log('certificate.app[applicationKey]?.id?.value', certificate.app?.[applicationKey], cert)
            return certificate?.app?.[applicationKey]?.id?.value === addr;
          })) {
            console.log('cert', certificate);
            return true;
          } else {
            return false;
          }
        }).map((key) => contract.template[key])


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
