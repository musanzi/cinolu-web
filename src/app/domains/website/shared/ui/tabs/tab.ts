import { Component, TemplateRef, input, viewChild } from '@angular/core';

@Component({
  selector: 'tab',
  templateUrl: './tab.html'
})
export class Tab {
  readonly label = input.required<string>();
  readonly key = input<string>();
  readonly icon = input<string>();
  readonly template = viewChild.required<TemplateRef<unknown>>('template');
}
