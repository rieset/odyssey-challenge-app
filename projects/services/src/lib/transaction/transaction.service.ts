import { Injectable } from '@angular/core';
import {
  broadcast,
  IInvokeScriptParams,
  invokeScript,
  transfer,
} from '@libs/waves-transactions/dist';
import { UserService } from '@services/user/user.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LogService } from '@services/log/log.service';


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
      const signedTransfer = transfer({
        recipient: user.address,
        amount: 1000000,
      }, this.faucet)

      broadcast(signedTransfer, 'https://nodes-testnet.wavesnodes.com')
      .catch((err) => {
      })
      .then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 2000)
        })
      })
      .then(() => {
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
        this.router.navigate(['/'])
      }).catch((error) => {
        console.log('Errors', error);
      })
    })
  }

  public sendScore (userAddress: string, score: number) {
    this.userService.user.pipe(take(1)).subscribe((user) => {
      const signedTransfer = transfer({
        recipient: user.address,
        amount: 1000000,
      }, this.faucet)

      broadcast(signedTransfer, 'https://nodes-testnet.wavesnodes.com')
      .catch((err) => {
      })
      .then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 2000)
        })
      })
      .then(() => {
        const params = {
          call: {
            args: [{ type: 'string', value: userAddress},
              { type: 'integer', value: score }],
            function: 'score',
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
        this.router.navigate(['/'])
      }).catch((error) => {
        console.log('Errors', error);
      })
    })
  }
}
