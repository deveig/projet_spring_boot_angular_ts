import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, catchError, tap } from 'rxjs';
import { Ingredient } from './ingredient.model';
import { IngredientService } from './ingredient.service';
import { regExpValidator } from './reg_exp_validator.function';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loader: boolean = true;
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

  constructor(private recipeService: IngredientService) {}

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
            this.loader = false;
          },
        }),
        catchError((error: Error) => {
          this.errorMessage =
            'Internal Server Error, please, retry your demand.';
          this.error = true;
          this.loader = false;
          // Returns a complete notification.
          return EMPTY;
        })
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
            this.loader = true;
            this.errorMessage = '';
            this.error = false;
            const quantityNumber = parseInt(quantity);
            this.recipeService
              .save(name, quantityNumber, metric)
              .pipe(
                tap({
                  next: (message: { message: string }) => {
                    if (message.message === 'Invalid data.') {
                      this.errorMessage = 'Invalid data.';
                      this.error = true;
                      this.loader = false;
                    }
                  },
                  complete: () => {
                    this.getAllIngredients();
                  },
                }),
                catchError((error: Error) => {
                  this.errorMessage =
                    'Internal Server Error, please, retry your demand.';
                  this.error = true;
                  this.loader = false;
                  // Returns a complete notification.
                  return EMPTY;
                })
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
    this.loader = true;
    this.errorMessage = '';
    this.error = false;
    this.recipeService
      .delete()
      .pipe(
        tap({
          next: (message: { message: string }) => {
            if (message.message === 'No ingredient to delete.') {
              this.errorMessage = 'No ingredient to delete.';
              this.error = true;
              this.loader = false;
            }
          },
          complete: () => {
            this.getAllIngredients();
          },
        }),
        catchError((error: Error) => {
          this.errorMessage =
            'Internal Server Error, please, retry your demand.';
          this.error = true;
          this.loader = false;
          // Returns a complete notification.
          return EMPTY;
        })
      )
      .subscribe();
  }
}
