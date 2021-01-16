import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-comparison-bar',
  styleUrls: ['./comparison-bar.component.scss'],
  templateUrl: './comparison-bar.component.html',
})
export class ComparisonBarComponent {

  @Input() barData: { prevDate: string; prevValue: number; nextDate: string; nextValue: number };
  @Input() successDelta: boolean;

  getPrevPercent(): number {
    if (this.barData.prevValue > this.barData.nextValue) {
      return 100;
    }

    return this.barData.prevValue / this.barData.nextValue * 100;
  }

  getNextPercent(): number {
    if (this.barData.nextValue > this.barData.prevValue) {
      return 100;
    }

    return this.barData.nextValue / this.barData.prevValue * 100;
  }

  isNextGreater() {
    return this.barData.nextValue > this.barData.prevValue;
  }
}
