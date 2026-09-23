import { NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, computed, contentChildren, model, viewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Tab } from './tab';

@Component({
  selector: 'tabs',
  imports: [MatIconModule, NgTemplateOutlet],
  templateUrl: './tabs.html'
})
export class Tabs {
  readonly activeKey = model<string>();

  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');
  protected readonly tabs = contentChildren(Tab);

  protected readonly activeTab = computed(() => {
    const tabs = this.tabs();
    const activeKey = this.activeKey();
    return tabs.find((tab) => (tab.key() ?? tab.label()) === activeKey) ?? tabs.at(0);
  });

  protected select(tab: Tab): void {
    this.activeKey.set(tab.key() ?? tab.label());
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const keys: string[] = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;

    event.preventDefault();

    const tabs = this.tabs();
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;

    this.select(tabs[nextIndex]);
    this.tabButtons().at(nextIndex)?.nativeElement.focus();
  }
}
