import { Injectable } from '@angular/core';
import {
  alias,
  broadcast,
  IInvokeScriptParams,
  invokeScript,
  transfer,
} from '@libs/waves-transactions/dist';
import { UserService } from '@services/user/user.service';
import { randomSeed, address } from '@waves/ts-lib-crypto';
import {map, switchMap, take} from 'rxjs/operators';
import {UserModel} from '@services/user/user.model';
import { Router } from '@angular/router';
import {LogService} from '@services/log/log.service';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private faucet = 'bracket shock warm motor quit more seed staff funny clerk toy run deal melt inner';

  constructor (
      private userService: UserService,
      private router: Router,
      private logService: LogService
  ) {}

  public async create (certificateAddress: string) {
    this.userService.user.pipe(take(1)).subscribe((user) => {

      console.log('User Address', user);

      const signedTranfer = transfer({
        recipient: user.address,
        amount: 1000000,
      }, this.faucet)

      broadcast(signedTranfer, 'https://nodes-testnet.wavesnodes.com')
      .catch((err) => {
        console.log('Faucet error', err);
      })
      .then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 2000)
        })
      })
      .then(() => {
        console.log('Result 1');
        const params = {
          call: {
            args: [{ type: 'string', value: certificateAddress },
              { type: 'string', value: user.address }],
            function: 'requestCertificate',
          },
          payment: [],
          dApp: '3Mvbw1Sx9xtM6akJrBPorkPpp4B3sJRFPFX',
          chainId: 'T',
          fee: 500000,
          feeAssetId: null
        } as IInvokeScriptParams

        const signedInvokeScriptTx = invokeScript(params, user.seed)
        return broadcast(signedInvokeScriptTx, 'https://nodes-testnet.wavesnodes.com').then((data) => {
          this.logService.apply(`Create transactions with facet: <a target="_blank" href="https://testnet.wavesexplorer.com/address/${user.address}/tx">Explorer</a>`, 'blockchain')
        })
      }).then((data) => {
        console.log('DATA', data)
        this.router.navigate(['/'])
      }).catch((error) => {
        console.log('Errors', error);
      })
    })
  }
}
