import { Component, OnInit } from '@angular/core';
import { createContent } from './utils/content.utils'

@Component({
  selector: 'lib-test-lib',
  template: `
    <p>
      test-lib (declared in library) works: {{text}}
    </p>
  `,
  styles: []
})
export class TestLibComponent implements OnInit {

  public text: string

  constructor() { }

  ngOnInit() {
    const content = createContent()

    this.text = `my content: ${content.name} / ${content.value}`
  }
}
