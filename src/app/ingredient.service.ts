import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Ingredient } from './ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  url: string = 'recipe';

  constructor(private http: HttpClient) {}

  /** Collects recipe ingredients.
   * @returns {Observable<Array<Ingredient>>}
   */
  getAllIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.url).pipe(
      catchError((error: Error) => {
        throw error;
      })
    );
  }

  /** Sends ingredient to API.
   * @param {string} name - Name of the ingredient.
   * @param {number} quantity - Quantity of the ingredient.
   * @param {string} metric - Metric of the ingredient.
   * @returns {Observable<{message: string}>}
   */
  save(
    name: string,
    quantity: number,
    metric: string
  ): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(this.url, {
        ingredient: name,
        quantity: quantity,
        unit: metric,
      })
      .pipe(
        catchError((error: Error) => {
          throw error;
        })
      );
  }

  /** Deletes the last ingredient.
   * @returns {Observable<{message: string}>}
   */
  delete(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.url).pipe(
      catchError((error: Error) => {
        throw error;
      })
    );
  }
}
