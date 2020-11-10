import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FooterComponent } from './footer.component'
import {PipesModule} from '@libs/pipes/pipes.module'

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    PipesModule
  ],
  exports: [FooterComponent]
})
export class FooterModule { }
