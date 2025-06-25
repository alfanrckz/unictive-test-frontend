import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="rating-container">
      <div class="stars">
        <mat-icon 
          *ngFor="let star of stars" 
          [class]="star.filled ? 'star-filled' : 'star-empty'">
          {{ star.filled ? 'star' : 'star_border' }}
        </mat-icon>
      </div>
      <span class="rating-text">{{ rating | number:'1.1-1' }} ({{ rating }})</span>
    </div>
  `,
  styles: [`
    .rating-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .stars {
      display: flex;
      align-items: center;
    }
    
    .star-filled {
      color: #ffc107;
    }
    
    .star-empty {
      color: #e0e0e0;
    }
    
    .rating-text {
      color: #666;
      font-size: 14px;
    }
    
    mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `]
})
export class RatingComponent {
  @Input() rating: number = 0;
  
  get stars() {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push({
        filled: i <= Math.round(this.rating)
      });
    }
    return stars;
  }
}