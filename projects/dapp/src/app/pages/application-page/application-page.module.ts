import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ApplicationPageRoutingModule } from './application-page-routing.module'
import { ApplicationPageComponent } from './application-page.component'
import {AgmCoreModule} from '@agm/core'
import {PipesModule} from '@libs/pipes/pipes.module'
import {MatButtonModule} from '@angular/material/button'
import { AgmOverlays } from 'agm-overlays'

@NgModule({
  declarations: [ApplicationPageComponent],
  imports: [
    CommonModule,
    ApplicationPageRoutingModule,
    AgmCoreModule,
    AgmOverlays,
    PipesModule,
    MatButtonModule,
  ],
})
export class ApplicationPageModule { }
