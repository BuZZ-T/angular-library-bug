import { Component, OnInit } from '@angular/core';
import { data } from './utils/data.utils'

@Component({
  selector: 'lib-test-lib',
  template: `
    <p>
      test-lib (declared in library) works
    </p>
  `,
  styles: []
})
export class TestLibComponent implements OnInit {

  public text: string

  constructor() {
    this.text = `my data: ${data.name} / ${data.value}`
  }

  ngOnInit() {
  }
}
