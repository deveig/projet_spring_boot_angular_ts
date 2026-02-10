import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { Ingredient } from './ingredient.model';
import { AppComponent } from './app.component';
import { IngredientService } from './ingredient.service';

describe('AppComponent', () => {
  // Creates a fake `recipeService` object with `getAllIngredients`, `save` and `delete` spies.
  let recipeService = jasmine.createSpyObj('IngredientService', [
    'getAllIngredients',
    'save',
    'delete',
  ]);
  let ingredients: Ingredient[];
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  beforeEach(() => {
    // Reassigns value of `recipeService`.
    recipeService = jasmine.createSpyObj('IngredientService', [
      'getAllIngredients',
      'save',
      'delete',
    ]);
    // Makes the spy of `getAllIngredients` returns a synchronous Observable with the list of ingredients.
    // Initializes the test data.
    ingredients = [{ id: 1, ingredient: 'salad', quantity: 1, unit: 'piece' }];
    recipeService.getAllIngredients.and.returnValue(of(ingredients));
    // Configures the test module.
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        AppComponent,
        {
          provide: IngredientService,
          useValue: recipeService,
        },
        // Sets automatic change detection for data binding.
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });
    TestBed.inject(AppComponent);
    TestBed.inject(IngredientService);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    // Performs data binding.
    fixture.detectChanges();
  });
  afterEach(() => {
    // Reassigns value of `recipeService`.
    recipeService = jasmine.createSpyObj('IngredientService', [
      'getAllIngredients',
      'save',
      'delete',
    ]);
  });
  it('should return recipe ingredients in the DOM', () => {
    // Gets the elements of the DOM.
    const elements = fixture.debugElement.nativeElement!;
    const table = elements.querySelector('tbody')!;
    const ingredientElement = table.lastElementChild!;
    // Expects that elements of the DOM contain values of the test data.
    expect(ingredientElement.childNodes[1].textContent).toEqual(
      ingredients[0].ingredient
    );
    expect(ingredientElement.childNodes[2].textContent).toEqual(
      ingredients[0].quantity.toString()
    );
    expect(ingredientElement.childNodes[3].textContent).toEqual(
      ingredients[0].unit
    );
    // Expects receive ingredients.
    expect(component.ingredientsList).toBe(ingredients);
    // Expects `getAllIngredients` method is called once.
    expect(recipeService.getAllIngredients).toHaveBeenCalledTimes(1);
  });
  it('should call `save` method because an ingredient has been added in the DOM', () => {
    // Arranges
    //  Makes the spy of `save` returns a synchronous Observable with a message.
    // Initializes the test data.
    const nameData = 'oil';
    const quantityData = 5;
    const metricData = 'cl';
    const backupMessage = { message: 'Data is saved.' };
    recipeService.save
      .withArgs(nameData, quantityData, metricData)
      .and.returnValue(of(backupMessage));
    component.name!.setValue(nameData);
    component.quantity!.setValue(quantityData);
    component.metric!.setValue(metricData);
    const plusButton = fixture.debugElement.query(By.css('.more-item'));

    // Acts
    plusButton.triggerEventHandler('click');

    // Asserts
    expect(recipeService.save).toHaveBeenCalledOnceWith(
      nameData,
      quantityData,
      metricData
    );
    // Expects `getAllIngredients` method is called.
    expect(recipeService.getAllIngredients).toHaveBeenCalledTimes(2);
  });
  it('should return an error message because an invalid ingredient has been added in the DOM', () => {
    // Arranges
    const nameData = 'oil5';
    const quantityData = 5;
    const metricData = 'cl';
    component.name!.setValue(nameData);
    component.quantity!.setValue(quantityData);
    component.metric!.setValue(metricData);
    const errorMessage = 'Name is a short word.';
    const plusButton = fixture.debugElement.query(By.css('.more-item'));

    // Acts
    plusButton.triggerEventHandler('click');

    // Asserts
    expect(component.errorMessage).toBe(errorMessage);
  });
  it('should call `delete` method because an ingredient has been deleted in the DOM', () => {
    // Arranges
    //  Makes the spy of `delete` returns a synchronous Observable with a message.
    // Initializes the test data.
    const deletionMessage = { message: 'Data is deleted.' };
    recipeService.delete.and.returnValue(of(deletionMessage));
    const minusButton = fixture.debugElement.query(By.css('.less-item'));

    // Acts
    minusButton.triggerEventHandler('click');

    // Asserts
    expect(recipeService.delete).toHaveBeenCalledTimes(1);
    // Expects `getAllIngredients` method is called.
    expect(recipeService.getAllIngredients).toHaveBeenCalledTimes(2);
  });
  it('should return a message when no ingredient to remove in the DOM', () => {
    // Arranges
    //  Makes the spy of `delete` returns a synchronous Observable with a message.
    // Initializes the test data.
    const badRequestMessage = 'No ingredient to delete.';
    const badRequestError = new Error(badRequestMessage);
    const httpErrorResponse = new HttpErrorResponse({
      error: badRequestError,
      status: 400,
      statusText: 'Bad request',
    });
    recipeService.delete.and.returnValue(throwError(() => httpErrorResponse));
    const minusButton = fixture.debugElement.query(By.css('.less-item'));

    // Acts
    minusButton.triggerEventHandler('click');

    // Asserts
    expect(recipeService.delete).toHaveBeenCalledTimes(1);
    expect(component.errorMessage).toBe(badRequestMessage);
  });
});
