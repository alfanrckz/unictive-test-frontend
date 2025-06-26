import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import { RatingComponent } from '../shared/components/rating/rating.component';
import { Product } from '../shared/interfaces/product.interface';
import { AuthService } from '../shared/services/auth.service';
import { NotificationService } from '../shared/services/notification.service';
import { ProductService } from '../shared/services/product.service';

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
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class HomeComponent implements OnInit {

    carouselImages = [
    'assets/images/9742750.jpg',
    'assets/images/9950409.jpg',
    'assets/images/6909821.jpg',
    'assets/images/1301.jpg',
  ];

  currentImageIndex = 0;
  carouselInterval: any;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  isLoading = true;
  isGridView = true;
  currentUser = this.authService.getCurrentUser();

  limit = 30;
  skip = 0;
  isEndOfList = false;
  isLoadingMore = false;

  isSearching = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProducts(true);
    this.startCarousel();
  }

  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
    }, 5000); 
  }

  nextSlide() {
  this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
}

  prevSlide() {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
  }


loadProducts(initial = false): void {
  if (initial) {
    this.isSearching = false;
    this.skip = 0;
    this.isEndOfList = false;
    this.isLoading = true;
  }

  if (this.isLoadingMore || this.isEndOfList) return;

  this.isLoadingMore = true;

  this.productService.getProducts(this.limit, this.skip).subscribe({
    next: (response) => {
      const newProducts = response.products;

      if (initial) {
        this.products = [...newProducts];
      } else {
        this.products = [...this.products, ...newProducts];
      }

      this.filteredProducts = [...this.products];
      this.skip += this.limit;

      if (newProducts.length < this.limit) {
        this.isEndOfList = true;
      }

      this.isLoading = false;
      this.isLoadingMore = false;
    },
    error: (error) => {
      this.notificationService.showError('Failed to load products');
      this.isLoading = false;
      this.isLoadingMore = false;
    }
  });
}



onScroll(): void {
  if (this.isSearching) return;
  const scrollPosition = window.innerHeight + window.scrollY;
  const threshold = document.body.offsetHeight - 100; 

  if (scrollPosition >= threshold) {
    this.loadProducts(); 
  }
}

checkScrollTrigger(): void {
  const scrollPosition = window.innerHeight + window.scrollY;
  const threshold = document.body.offsetHeight - 100;

  if (scrollPosition >= threshold) {
    this.loadProducts();
  }
}


onSearch(): void {
  const query = this.searchQuery.toLowerCase().trim();

  if (!query || query === '') {
    this.isSearching = false;
    this.loadProducts(true); 
    return;
  }

  this.isLoading = true;

  this.productService.searchProducts(query).subscribe({
    next: (response) => {
      this.products = [...response.products];
      this.filteredProducts = [...response.products];
      this.isLoading = false;
      this.isEndOfList = true;
    },
    error: (error) => {
      console.error('Error searching products:', error);
      this.notificationService.showError('Failed to search products');
      this.isLoading = false;
    }
  });
}


clearSearch(): void {
  this.searchQuery = '';
  this.isSearching = false;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => {
    this.loadProducts(true);

    setTimeout(() => {
      this.checkScrollTrigger();
    }, 200);
  }, 0);
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