import {Inject, Pipe, PipeTransform, PLATFORM_ID, SecurityContext } from '@angular/core'
import { DomSanitizer, SafeValue } from '@angular/platform-browser'
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify'
import {isPlatformBrowser} from '@angular/common'

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor (
    private readonly sanitizer: DomSanitizer,
    private readonly dompurifySanitizer: NgDompurifySanitizer,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {}

  transform (value: string, context: SecurityContext = SecurityContext.HTML): SafeValue | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        return this.bypassSecurityTrust(
          context,
          this.dompurifySanitizer.sanitize(context, value, { ADD_TAGS: ['iframe'] }),
        )
      } catch (e) {
        return this.sanitizer.sanitize(context, value)
      }
    } else {
      return this.sanitizer.sanitize(context, value)
    }
  }

  private bypassSecurityTrust (context: SecurityContext, purifiedValue: string): SafeValue | null {
    switch (context) {
      case SecurityContext.HTML:
        return this.sanitizer.bypassSecurityTrustHtml(purifiedValue)
      case SecurityContext.STYLE:
        return this.sanitizer.bypassSecurityTrustStyle(purifiedValue)
      case SecurityContext.SCRIPT:
        return this.sanitizer.bypassSecurityTrustScript(purifiedValue)
      case SecurityContext.URL:
        return this.sanitizer.bypassSecurityTrustUrl(purifiedValue)
      case SecurityContext.RESOURCE_URL:
        return this.sanitizer.bypassSecurityTrustResourceUrl(purifiedValue)
      default:
        return null
    }
  }
}
