import { Injectable } from '@angular/core'
import {ReplaySubject} from 'rxjs'
import {publishReplay, refCount} from 'rxjs/operators'
import { LogMessageModel } from './log.model'

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private log$: ReplaySubject<LogMessageModel>  = new ReplaySubject(20)

  public stream = this.log$.pipe()

  constructor () {}

  apply (message: string, type = 'send') {
    this.log$.next({
      message,
      datetime: new Date().valueOf(),
      type
    })
  }



}
