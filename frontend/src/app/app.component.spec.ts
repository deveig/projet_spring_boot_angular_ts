import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { Ingredient } from './ingredient.model';
import { IngredientService } from './ingredient.service';
import { User } from './user.model';

describe('AppComponent manages ingredient', () => {
  // Creates a fake `recipeService` object with `getUser`, `saveUser`, `getUser`, `getAllIngredients`, `save` and `delete` spies.
  let recipeServiceSpy = jasmine.createSpyObj('IngredientService', [
    'getUser',
    'saveUser',
    'getAllIngredients',
    'save',
    'delete',
  ]);
  let recipeService: IngredientService;
  let ingredients: { ingredientsList: Ingredient[] };
  let user: User;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    // Reassigns value of `recipeService`.
    recipeServiceSpy = jasmine.createSpyObj('IngredientService', [
      'getUser',
      'saveUser',
      'getAllIngredients',
      'save',
      'delete',
    ]);

    // Makes the spy of `getAllIngredients` returns a synchronous Observable with the list of ingredients.
    // Initializes the test data.
    user = { id: 1, userName: 'sandra', password: 'R2@#3/Mlk' };
    ingredients = {
      ingredientsList: [{ id: 1, ingredient: 'salad', quantity: 1, unit: 'piece', user: user }],
    };
    // Makes the spy of `localStorage` get item returns user.
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));
    // Starts ngOnInit
    recipeServiceSpy.getUser.and.returnValue(of({token: user})); 
    recipeServiceSpy.getAllIngredients.and.returnValue(of(ingredients));
    // Configures the test module.
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        AppComponent,
        {
          provide: IngredientService, 
          useValue: recipeServiceSpy,
        },
        // Sets automatic change detection for data binding.
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });
    // TestBed.inject(AppComponent);
    recipeService = TestBed.inject(IngredientService); 
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    // Performs data binding.
    fixture.detectChanges();
  });
  afterEach(() => {
    // Reassigns value of `recipeService`.
    recipeServiceSpy = jasmine.createSpyObj('IngredientService', [
      'getUser',
      'saveUser',
      'getAllIngredients',
      'save',
      'delete',
    ]);
  });
  it('should return recipe ingredients in the DOM', () => {
    // Gets the elements of the DOM.
    const ingredientElement = fixture.debugElement.nativeElement.querySelector('tbody');
    //Expects that elements of the DOM contain values of the test data.
    expect(ingredientElement.lastElementChild.childNodes[1].textContent).toEqual(
      ingredients.ingredientsList[0].ingredient,
    );
    expect(ingredientElement.lastElementChild.childNodes[2].textContent).toEqual(
      ingredients.ingredientsList[0].quantity.toString(),
    );
    expect(ingredientElement.lastElementChild.childNodes[3].textContent).toEqual(
      ingredients.ingredientsList[0].unit,
    );
    // expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    // Expects receive user.
    expect(recipeService.getUser).toHaveBeenCalledTimes(1);
    expect(component.user).toEqual(user);
    // Expects receive ingredients.
    expect(recipeService.getAllIngredients).toHaveBeenCalledTimes(1);
    expect(component.ingredientsList).toEqual(ingredients.ingredientsList);
  });
  it('should call `save` method because an ingredient has been added in the DOM', () => {
    // Arranges
    //  Makes the spy of `save` returns a synchronous Observable with a message.
    // Initializes the test data.
    const nameData = 'oil';
    const quantityData = 5;
    const metricData = 'cl';
    const backupMessage: { message: string } = { message: 'Data is saved.' };
    recipeServiceSpy.save
      .withArgs(nameData, quantityData, metricData)
      .and.returnValue(of(backupMessage));
    recipeServiceSpy.getAllIngredients.and.returnValue(
      of({
        ingredientsList: [
          {
            id: 1,
            ingredient: 'salad',
            quantity: 1,
            unit: 'piece',
            user: user,
          },
          {
            id: 2,
            ingredient: nameData,
            quantity: quantityData,
            unit: metricData,
            user: user,
          },
        ],
      }),
    );
    component.name!.setValue(nameData);
    component.quantity!.setValue(quantityData);
    component.metric!.setValue(metricData);
    const plusButton = fixture.debugElement.query(By.css('.more-item'));

    // Acts
    plusButton.triggerEventHandler('click');

    // Asserts
    expect(recipeService.save).toHaveBeenCalledOnceWith(nameData, quantityData, metricData);
    expect(localStorage.getItem).toHaveBeenCalled();
    // Expects `getAllIngredients` method is called.
    expect(recipeService.getAllIngredients).toHaveBeenCalled();
    expect(component.ingredientsList[1].ingredient).toEqual(nameData);
    expect(component.ingredientsList[1].quantity).toEqual(quantityData);
    expect(component.ingredientsList[1].unit).toEqual(metricData);
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
    expect(component.errorMessageIngredient).toBe(errorMessage);
  });
  it('should call `delete` method because an ingredient has been deleted in the DOM', () => {
    // Arranges
    //  Makes the spy of `delete` returns a synchronous Observable with a message.
    // Initializes the test data.
    const deletionMessage: { message: string } = {
      message: 'Data is deleted.',
    };
    recipeServiceSpy.delete.and.returnValue(of(deletionMessage));
    const minusButton = fixture.debugElement.query(By.css('.less-item'));

    // Acts
    minusButton.triggerEventHandler('click');

    // Asserts
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(recipeService.delete).toHaveBeenCalledTimes(1);
    // Expects `getAllIngredients` method is called.
    expect(recipeService.getAllIngredients).toHaveBeenCalled();
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
    recipeServiceSpy.delete.and.returnValue(throwError(() => httpErrorResponse));
    const minusButton = fixture.debugElement.query(By.css('.less-item'));

    // Acts
    minusButton.triggerEventHandler('click');

    // Asserts
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(recipeService.delete).toHaveBeenCalledTimes(1);
    expect(component.errorMessageIngredient).toBe(badRequestMessage);
  });
});
describe('AppComponent saves user', () => {
  // Creates a fake `recipeService` object with `getUser`, `saveUser`, `getUser`, `getAllIngredients`, `save` and `delete` spies.
  let recipeServiceSpy = jasmine.createSpyObj('IngredientService', [
    'getUser',
    'saveUser',
    'getAllIngredients',
    'save',
    'delete',
  ]);
  let recipeService: IngredientService;
  let ingredients: { ingredientsList: Ingredient[] };
  let user: User;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    // Reassigns value of `recipeService`.
    recipeServiceSpy = jasmine.createSpyObj('IngredientService', [
      'getUser',
      'saveUser',
      'getAllIngredients',
      'save',
      'delete',
    ]);

    // Makes the spy of `getAllIngredients` returns a synchronous Observable with the list of ingredients.
    // Initializes the test data.
    user = { id: 1, userName: 'sandra', password: 'R2@#3/Mlk' };
    ingredients = {
      ingredientsList: [],
    };
    // Makes the spy of `localStorage` get item returns user.
    spyOn(localStorage, 'getItem').and.returnValue(null);
    // Starts ngOnInit
    recipeServiceSpy.getAllIngredients.and.returnValue(of(ingredients));
    // Configures the test module.
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        AppComponent,
        {
          provide: IngredientService, 
          useValue: recipeServiceSpy,
        },
        // Sets automatic change detection for data binding.
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });
    // TestBed.inject(AppComponent);
    recipeService = TestBed.inject(IngredientService); 
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    // Performs data binding.
    fixture.detectChanges();
  });
  afterEach(() => {
    // Reassigns value of `recipeService`.
    recipeServiceSpy = jasmine.createSpyObj('IngredientService', [
      'getUser',
      'saveUser',
      'getAllIngredients',
      'save',
      'delete',
    ]);
  });
  it('should call `saveUser` method because an user has been added in the DOM', () => {
    // Arranges
    // Makes the spy of `saveUser` returns a synchronous Observable with a message.
    // Initializes the test data.
    const userName = 'sandra ';
    component.userName!.setValue(userName);
    recipeServiceSpy.saveUser.withArgs(userName).and.returnValue(of({token: user}));
    //  Makes the spy of `localStorage` set item `user` equal to user.
    spyOn(localStorage, 'setItem');
    localStorage.setItem('user', JSON.stringify(user));

    const plusButton = fixture.debugElement.query(By.css('.more-user'));

    // Acts
    plusButton.triggerEventHandler('click');

    // Asserts
    expect(recipeService.saveUser).toHaveBeenCalledOnceWith(userName);
    expect(component.user).toEqual(user);
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));
    expect(component.ingredientsList).toEqual([]);
  });
});
