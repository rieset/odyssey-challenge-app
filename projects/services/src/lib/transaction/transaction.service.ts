import { Injectable } from '@angular/core';
import {broadcast, IInvokeScriptParams, invokeScript, transfer } from '@libs/waves-transactions/dist';
import { UserService } from '@services/user/user.service';
import { randomSeed, address } from '@waves/ts-lib-crypto';
import {map, switchMap, take} from 'rxjs/operators';
import {UserModel} from '@services/user/user.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  [x: string]: any;
  private faucet = 'junior describe disorder harsh broom detect index tonight tray method miracle whisper master since impose';

  constructor (
      private userService: UserService,
      private router: Router
  ) {}

  public async create (certificateAddress: string) {
    const userSeed = randomSeed();
    const userAddress = address(userSeed, 'T');

    const signedTranferViaPrivateKey = transfer({
      recipient: userAddress,
      amount: 2000000,
      feeAssetId: null
    }, this.faucet)

    console.log('Translate');

    this.userService.user.pipe(take(1)).subscribe((user) => {
      broadcast(signedTranferViaPrivateKey, 'https://nodes-testnet.wavesnodes.com')
      .then(() => {
        console.log('user', user);

        setTimeout(() => {
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

          console.log('use -->', user);
          const signedInvokeScriptTx = invokeScript(params, userSeed)
          return broadcast(signedInvokeScriptTx, 'https://nodes-testnet.wavesnodes.com')
        }, 1000)
      }).then(() => {
        this.router.navigate(['/'])
      })
    })

  }
}
