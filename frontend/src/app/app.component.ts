import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, catchError, tap } from 'rxjs';
import { Ingredient } from './ingredient.model';
import { User } from './user.model';
import { IngredientService } from './ingredient.service';
import { regExpValidator } from './reg_exp_validator.function';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loader = signal<boolean>(true);
  user: User | null = null;
  ingredientsList: Ingredient[] = [];
  ingredientsListLength: number = 0;
  userForm: FormGroup = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
      regExpValidator(/\d+/),
    ]),
  });
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
  errorIngredient: boolean = false;
  errorUser: boolean = false;
  errorMessageIngredient: string = '';
  errorMessageUser: string = '';

  constructor(private recipeService: IngredientService) {}

  ngOnInit() {
    this.getUser();
  }

  get userName() {
    return this.userForm.get('userName');
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

  /** Adds recipe user to `user`. */
  getUser() {
    if (localStorage.getItem('user') != null) {
      this.recipeService
        .getUser()
        .pipe(
          tap({
            next: (value) => {
              if (value.token.id != null) {
                this.user = value.token;
              }
              this.getAllIngredients();
            },
          }),
          catchError((error) => {
            const httpErrorResponse = error as HttpErrorResponse;
            if (httpErrorResponse.error.message === 'Bad request.') {
              this.errorMessageUser =
                'Internal Server Error, please, retry your demand.';
            } else {
              this.errorMessageUser =
                'Internal Server Error, please, retry your demand.';
            }
            this.loader.set(false);
            // Returns a complete notification.
            return EMPTY;
          })
        )
        .subscribe();
      } else {
        this.getAllIngredients();
      }
  }

  /** Saves submitted form user. */
  onSaveUser() {
    const userName = this.userName!.value;
    const isNumber = new RegExp(/\d+/);
    // Checks content of each field.
    if (userName != '') {
      if (userName.length <= 50 && !isNumber.test(userName)) {
        this.loader.set(true);
        this.errorMessageUser = '';
        this.userForm.setValue({
          userName: '',
        });
        this.recipeService
          .saveUser(userName)
          .pipe(
            tap({
              next: (value) => {
                this.user = value.token;
                localStorage.setItem('user', JSON.stringify(value.token));
                this.getAllIngredients();
              },
            }),
            catchError((error) => {
              const httpErrorResponse = error as HttpErrorResponse;
              if (httpErrorResponse.error.message === 'Enter your name.') {
                this.errorMessageUser = 'Enter your name.';
                this.loader.set(false);
              } else {
                this.errorMessageUser =
                  'Internal Server Error, please, retry your demand.';
                this.loader.set(false);
              }
              // Returns a complete notification.
              return EMPTY;
            })
          )
          .subscribe();
      } else {
        this.errorMessageUser = 'Enter your name.';
      }
    } else {
      this.errorMessageUser = 'Enter your name.';
    }
  }

  /** Adds recipe ingredients to `ingredientsList`. */
  getAllIngredients() {
    if (localStorage.getItem('user') != null) {
      this.recipeService
        .getAllIngredients()
        .pipe(
          tap({
            next: (value) => {
              this.ingredientsList = value.ingredientsList;
              this.ingredientsListLength = value.ingredientsList.length;
              this.loader.set(false);
            },
          }),
          catchError((error) => {
            this.errorMessageIngredient =
              'Internal Server Error, please, retry your demand.';
            this.loader.set(false);

            // Returns a complete notification.
            return EMPTY;
          })
        )
        .subscribe();
    } else {
      this.ingredientsList = [];
      this.errorMessageUser = 'Enter your name.';
      this.loader.set(false);
    }
  }

  /** Saves submitted form ingredient. */
  onSave() {
    if (localStorage.getItem('user') != null) {
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
              this.errorMessageIngredient = '';
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
                      this.errorMessageIngredient = 'Invalid data.';
                    } else {
                      this.errorMessageIngredient =
                        'Internal Server Error, please, retry your demand.';
                    }
                    this.loader.set(false);
                    // Returns a complete notification.
                    return EMPTY;
                  })
                )
                .subscribe();
            } else {
              this.errorMessageIngredient = 'Metric is a short word.';
            }
          } else {
            this.errorMessageIngredient = 'Quantity is a positive number.';
          }
        } else {
          this.errorMessageIngredient = 'Name is a short word.';
        }
      } else {
        this.errorMessageIngredient = 'All fields are required.';
      }
    } else {
      this.errorMessageUser = 'Enter your name.';
    }
  }

  /** Deletes the last ingredient of the list. */
  onDelete() {
    if (localStorage.getItem('user') != null) {
      this.loader.set(true);
      this.errorMessageIngredient = '';
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
            if (
              httpErrorResponse.error.message === 'No ingredient to delete.'
            ) {
              this.errorMessageIngredient = 'No ingredient to delete.';
            } else {
              this.errorMessageIngredient =
                'Internal Server Error, please, retry your demand.';
            }
            this.loader.set(false);
            // Returns a complete notification.
            return EMPTY;
          })
        )
        .subscribe();
    }  else {
      this.errorMessageUser = 'Enter your name.';
    }
  }
}