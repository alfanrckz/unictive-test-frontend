import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { Product } from '../shared/interfaces/product.interface';
import { ProductService } from '../shared/services/product.service';
import { AuthService } from '../shared/services/auth.service';
import { NotificationService } from '../shared/services/notification.service';
import { RatingComponent } from '../shared/components/rating/rating.component';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatGridListModule,
    RatingComponent,
    LoadingComponent,
    FormsModule,
    MatFormFieldModule
  ]
})
export class HomeComponent implements OnInit {

    carouselImages = [
    'assets/images/5687924.jpg',
    'assets/images/9950409.jpg',
    'assets/images/1301.jpg',
  ];

  currentImageIndex = 0;
  carouselInterval: any;

  products: Product[] = [];
  searchQuery: string = '';
  isLoading = true;
  isGridView = true;
  currentUser = this.authService.getCurrentUser();

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.startCarousel();
  }

  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
    }, 5000); // ganti gambar tiap 5 detik
  }

  nextSlide() {
  this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
}

  prevSlide() {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.notificationService.showError('Failed to load products');
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
  const query = this.searchQuery.toLowerCase().trim();
  this.products = this.products.filter(p =>
    p.title.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.products = [...this.products];
  }

  viewProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.showInfo('Logged out successfully');
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    clearInterval(this.carouselInterval);
  }

}