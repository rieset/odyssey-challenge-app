import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'timeLeft',
  pure: false
})
export class TimeLeftPipe implements PipeTransform {
  transform (value: number) {
    return ('**' + Math.round((new Date().valueOf() - value) / 1000)).slice(-3) + 's left'
  }
}
