import { isPlatformBrowser, DOCUMENT } from '@angular/common'
import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PreloaderService {
  private loaded$ = new BehaviorSubject(false);

  public isBrowser;

  constructor (
      @Inject(PLATFORM_ID) platformId: object,
      @Inject(DOCUMENT) public document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId)
  }

  public load () {
    this.loaded$.next(true)
    this.document.dispatchEvent(new Event('load-content'))
  }

  public get stream (): Observable<boolean> {
    return this.loaded$
  }
}
