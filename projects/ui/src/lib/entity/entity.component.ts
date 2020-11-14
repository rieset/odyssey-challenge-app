import { Component, Input, OnInit } from '@angular/core'
import {ContractCertificateModel } from '@services/contract/contract.model'

@Component({
  selector: 'ui-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit {
  @Input() entity: ContractCertificateModel = {}

  constructor () {}

  ngOnInit (): void {}
}
