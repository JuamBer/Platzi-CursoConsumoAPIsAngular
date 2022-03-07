import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';

import { Product, CreateProductDTO, UpdateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import { R3TargetBinder } from '@angular/compiler';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  productChosen: Product = {
    id: 0,
    price: 0,
    images: [],
    title: '',
    category: {
      id: 0,
      name: ''
    },
    description: ''
  };
  limit: number = 10;
  offset: number = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';
  showProductDetails: boolean = false;

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.loadMoreProducts();
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDeatil(){
    this.showProductDetails = !this.showProductDetails;
  }

  onShowDetails(id: number){
    this.statusDetail = 'loading';
    this.productsService.getProduct(id)
    .subscribe(data => {
      this.toggleProductDeatil();
      this.productChosen = data;
      this.statusDetail = 'success';
    }, error => {
      console.error(error);
      this.statusDetail = 'error';
    });

  }

  readAndUpdate(id: number){
    this.productsService.getProduct(id)
      .pipe(
        switchMap((product) => {
          return this.productsService.update(product.id, { title: 'changed' })
        })
      )
      .subscribe(data => {
        console.log(data);
      });
  }

  createNewProduct(){
    const newProduct: CreateProductDTO = {
      title: 'Nuevo Producto',
      price: 1000,
      description: 'description',
      images: [],
      categoryId: 3
    }
    this.productsService.create(newProduct)
    .subscribe(data =>{
      this.products.unshift(data);
    });
  }

  updateProduct(){
    const changes = {
      title: 'asda'
    }
    const id = this.productChosen.id;

    this.productsService.update(id, changes).subscribe(data =>{
      const productIndex = this.products.findIndex(item => item.id == id);
      this.products[productIndex] = data;
    });
  }
  deleteProduct(){
    const id = this.productChosen.id;
    this.productsService.delete(id).subscribe(() => {
      const productIndex = this.products.findIndex(item => item.id == id);
      this.products.splice(productIndex,1);
      this.showProductDetails = false;
    });
  }

  loadMoreProducts(){
    this.productsService.getProductsByPage(this.limit, this.offset)
      .subscribe(data => {
        this.products = this.products.concat(data);
        this.offset += this.limit;
      });
  }
}
