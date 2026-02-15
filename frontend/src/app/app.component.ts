import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, catchError, tap } from 'rxjs';
import { Ingredient } from './ingredient.model';
import { IngredientService } from './ingredient.service';
import { regExpValidator } from './reg_exp_validator.function';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class AppComponent implements OnInit {
  loader = signal<boolean>(true);
  ingredientsList: Ingredient[] = [];
  ingredientsListLength: number = 0;
  ingredientForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(25),
      regExpValidator(/\d+/),
    ]),
    quantity: new FormControl('', [
      Validators.required,
      regExpValidator(/\D+/),
      Validators.pattern(/[^0]/),
      regExpValidator(/-\d+/),
    ]),
    metric: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      regExpValidator(/\d+/),
    ]),
  });
  error: boolean = false;
  errorMessage: string = '';

  constructor(private recipeService: IngredientService, private router: Router) {}

  ngOnInit() {
    this.getAllIngredients();
  }

  get name() {
    return this.ingredientForm.get('name');
  }

  get quantity() {
    return this.ingredientForm.get('quantity');
  }

  get metric() {
    return this.ingredientForm.get('metric');
  }

  /** Adds recipe ingredients to `ingredientsList`. */
  getAllIngredients() {
    this.recipeService
      .getAllIngredients()
      .pipe(
        tap({
          next: (ingredientsList: Ingredient[]) => {
            this.ingredientsList = ingredientsList;
            this.ingredientsListLength = ingredientsList.length;
            this.loader.set(false);
          },
        }),
        catchError((error) => {
          this.errorMessage = 'Internal Server Error, please, retry your demand.';
          this.error = true;
          this.loader.set(false);
          // Returns a complete notification.
          return EMPTY;
        }),
      )
      .subscribe();
  }

  /** Saves submitted form ingredient. */
  onSave() {
    const name = this.name!.value;
    const quantity = this.quantity!.value;
    const metric = this.metric!.value;
    const isString = new RegExp(/\D+/);
    const isNumber = new RegExp(/\d+/);
    const isNegativeNumber = new RegExp(/-\d+/);
    const isNotEqualToZero = new RegExp(/[^0]/);
    // Checks content of each field.
    if (name !== '' && quantity !== '' && metric !== '') {
      if (name.length <= 25 && !isNumber.test(name)) {
        if (
          !isString.test(quantity) &&
          !isNegativeNumber.test(quantity) &&
          isNotEqualToZero.test(quantity)
        ) {
          if (metric.length <= 10 && !isNumber.test(metric)) {
            this.loader.set(true);
            this.errorMessage = '';
            this.error = false;
            this.ingredientForm.setValue({
              name: '',
              quantity: '',
              metric: '',
            });
            const quantityNumber = parseInt(quantity);
            this.recipeService
              .save(name, quantityNumber, metric)
              .pipe(
                tap({
                  complete: () => {
                    this.getAllIngredients();
                  },
                }),
                catchError((error) => {
                  const httpErrorResponse = error as HttpErrorResponse;
                  if (httpErrorResponse.error.message === 'Invalid data.') {
                    this.errorMessage = 'Invalid data.';
                    this.error = true;
                    this.loader.set(false);
                  } else {
                    this.errorMessage = 'Internal Server Error, please, retry your demand.';
                    this.error = true;
                    this.loader.set(false);
                  }
                  // Returns a complete notification.
                  return EMPTY;
                }),
              )
              .subscribe();
          } else {
            this.errorMessage = 'Metric is a short word.';
            this.error = true;
          }
        } else {
          this.errorMessage = 'Quantity is a positive number.';
          this.error = true;
        }
      } else {
        this.errorMessage = 'Name is a short word.';
        this.error = true;
      }
    } else {
      this.errorMessage = 'All fields are required.';
      this.error = true;
    }
  }

  /** Deletes the last ingredient of the list. */
  onDelete() {
    this.loader.set(true);
    this.errorMessage = '';
    this.error = false;
    this.recipeService
      .delete()
      .pipe(
        tap({
          complete: () => {
            this.getAllIngredients();
          },
        }),
        catchError((error) => {
          const httpErrorResponse = error as HttpErrorResponse;
          if (httpErrorResponse.error.message === 'No ingredient to delete.') {
            this.errorMessage = 'No ingredient to delete.';
            this.error = true;
            this.loader.set(false);
          } else {
            this.errorMessage = 'Internal Server Error, please, retry your demand.';
            this.error = true;
            this.loader.set(false);
          }
          // Returns a complete notification.
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
