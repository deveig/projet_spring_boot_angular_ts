import { Injectable } from '@angular/core';
import { Observable, of, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Ingredient } from './ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  url: string = 'recipe';

  constructor(private http: HttpClient) {}

  /** Collects recipe ingredients.
   * @returns {(Observable<Array<Ingredient>>)}
   */
  getAllIngredients(): Observable<Ingredient[]> {
    return this.http
      .get<Ingredient[]>(this.url)
      .pipe(
        catchError(this.handleError<Ingredient[]>('getAllIngredients', []))
      );
  }

  /** Sends ingredient to API.
   * @param {string} name - Name of the ingredient.
   * @param {number} quantity - Quantity of the ingredient.
   * @param {string} metric - Metric of the ingredient.
   * @returns {Observable<Map<string, string>>}
   */
  save(
    name: string,
    quantity: number,
    metric: string
  ): Observable<Map<string, string>> {
    return this.http
      .post<Map<string, string>>(this.url, {
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

  /**
   * Handles Http operation that failed.
   * Lets the app continue.
   * @param {string} operation - Name of the operation that failed.
   * @param {T} [result] - Optional value to return as the observable result.
   * @returns {Observable<T>}
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: Error): Observable<T> => {
      // Lets the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
