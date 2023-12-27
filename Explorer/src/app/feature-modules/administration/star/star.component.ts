import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star',
  template: `<span *ngFor="let _ of stars; let i = index">&#9733;</span>`,
})
export class StarComponent {
  @Input() set rating(value: number) {
    this.stars = Array(Math.round(value)).fill(0);
  }

  stars: number[] = [];
}