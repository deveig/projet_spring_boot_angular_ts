import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Ingredient } from './ingredient.model';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  url: string = '/recipe-spring-angular/recipe';

  constructor(private http: HttpClient) {}

    /** Sends ingredient to API.
   * @param {string} userName - userName.
   * @returns {Observable<{token: User}>}
   */
  saveUser(userName: string): Observable<{ token: User }> {
    return this.http
      .post<{ token: User }>(this.url + '/user', {
        userName: userName,
      })
      .pipe(
        catchError((error: Error) => {
          throw error;
        }),
      );
  }

  /** Collects recipe user.
   * @returns {Observable<{ token: User }>}
   */
  getUser(): Observable<{ token: User }> {
    return this.http
      .get<{ token: User }>(this.url + '/user', {
        headers: {
          Authorization: `Bearer ${JSON.stringify(localStorage.getItem('user'))}`,
        },
      })
      .pipe(
        catchError((error: Error) => {
          throw error;
        }),
      );
  }

  /** Collects recipe ingredients.
   * @returns {Observable<{ingredientsList: Array<Ingredient>}>}
   */
  getAllIngredients(): Observable<{ ingredientsList: Ingredient[] }> {
    return this.http
      .get<{ ingredientsList: Ingredient[] }>(this.url, {
        headers: {
          Authorization: `Bearer ${JSON.stringify(localStorage.getItem('user'))}`,
        },
      })
      .pipe(
        catchError((error: Error) => {
          throw error;
        }),
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
    metric: string,
  ): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(
        this.url,
        {
          ingredient: name,
          quantity: quantity,
          unit: metric,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.stringify(localStorage.getItem('user'))}`,
          },
        },
      )
      .pipe(
        catchError((error: Error) => {
          throw error;
        }),
      );
  }

  /** Deletes the last ingredient.
   * @returns {Observable<{message: string}>}
   */
  delete(): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(this.url, {
        headers: {
          Authorization: `Bearer ${JSON.stringify(localStorage.getItem('user'))}`,
        },
      })
      .pipe(
        catchError((error: Error) => {
          throw error;
        }),
      );
  }
}
