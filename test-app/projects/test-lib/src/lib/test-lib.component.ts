import { Component, OnInit } from '@angular/core';
import { data } from './utils/data.utils'
import { dataWorkaround } from './utils/workaround.utils'

@Component({
  selector: 'lib-test-lib',
  template: `
    <p>
      test-lib (declared in library) works: {{text}} / {{workaroundText}}
    </p>
  `,
  styles: []
})
export class TestLibComponent implements OnInit {

  public text: string
  public workaroundText: string

  constructor() {
    this.text = `my data: ${data.name} / ${data.value}`
    this.workaroundText = dataWorkaround.name
  }

  ngOnInit() {
  }
}
