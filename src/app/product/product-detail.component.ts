import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { Product } from '../shared/interfaces/product.interface';
import { ProductService } from '../shared/services/product.service';
import { NotificationService } from '../shared/services/notification.service';
import { RatingComponent } from '../shared/components/rating/rating.component';
import { LoadingComponent } from '../shared/components/loading/loading.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    RatingComponent,
    LoadingComponent
  ],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  selectedImage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    } else {
      this.isLoading = false;
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = product.thumbnail;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.notificationService.showError('Failed to load product details');
        this.isLoading = false;
      }
    });
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  getOriginalPrice(): number {
    if (!this.product) return 0;
    return Math.round((this.product.price / (1 - this.product.discountPercentage / 100)) * 100) / 100;
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}