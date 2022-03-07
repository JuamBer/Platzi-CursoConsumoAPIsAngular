import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { checkTime } from './../interceptors/time.interceptor';

import { Product, CreateProductDTO, UpdateProductDTO } from './../models/product.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl: string = `${environment.API_URL}/api/products`;

  constructor(
    private http: HttpClient
  ) { }

  getProduct(id: number){
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(catchError((error: HttpErrorResponse)=> {
      if(error.status === 500){
        return throwError('algo ha fallado en el server');
      }
      if (error.status === 404) {
        return throwError('el producto no existe');
      }
      return throwError('ups');
     }));
  }

  getProductsByPage(limit: number, offset: number){
    return this.http.get<Product[]>(this.apiUrl, {
      params: { limit, offset }, context: checkTime()
    }).pipe(
      retry(3),
      map(products => products.map(item => {
        const val = {
          ...item,
          taxes: .21 * item.price
        };
        return val
      }))
    );
  }

  getAllProducts(limit?: number, offset?: number) {
    let params: HttpParams = new HttpParams();

    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }

    return this.http.get<Product[]>(this.apiUrl, { params, context: checkTime() }).pipe(
      retry(3),
      map(products => products.map(item => {
        const val = {
          ...item,
          taxes: .21 * item.price
        };
        console.log("asasasassa",val);
        return val
      }))
    );
  }

  create(dto: CreateProductDTO){
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateProductDTO){
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
