import { Component, AfterContentInit, ContentChildren, QueryList, Input } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css'],
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs?: QueryList<TabComponent>;

  constructor() {}

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter(t => t.active);

    if(!activeTabs || !activeTabs.length) this.selectTab(this.tabs!.first)

  }

  selectTab(tab: TabComponent) {
    this.tabs?.forEach(t => t.active = false);

    tab.active = true;

    // as preventDefault
    return false;
  }
}
