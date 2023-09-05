import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { Ingredient } from './ingredient.model';
import { AppComponent } from './app.component';
import { IngredientService } from './ingredient.service';

let ingredients: Ingredient[];
let appComponent: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let component: AppComponent;

beforeEach(() => {
  // Initializes the test data.
  ingredients = [{ id: 1, ingredient: 'salad', quantity: 1, unit: 'piece' }];
  // Creates a fake `recipeService` object with a `getAllIngredients` spy.
  const recipeService = jasmine.createSpyObj('IngredientService', [
    'getAllIngredients',
  ]);
  // Makes the spy returns a synchronous Observable with the test data.
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
  appComponent = TestBed.inject(AppComponent);
  TestBed.inject(IngredientService);
  fixture = TestBed.createComponent(AppComponent);
  component = fixture.componentInstance;
});

describe('AppComponent', () => {
  it('should return recipe ingredients in the DOM', () => {
    // Initializes `AppComponent`.
    appComponent.ngOnInit();
    fixture.detectChanges();
    // Gets the elements of DOM.
    const elements = fixture.debugElement.nativeElement!;
    const table = elements.querySelector('tbody')!;
    const ingredientElement = table.lastElementChild!;
    // Expects that elements of the DOM contains the values of test data.
    expect(ingredientElement.childNodes[1].textContent).toEqual(
      ingredients[0].ingredient
    );
    expect(ingredientElement.childNodes[2].textContent).toEqual(
      ingredients[0].quantity.toString()
    );
    expect(ingredientElement.childNodes[3].textContent).toEqual(
      ingredients[0].unit
    );
    expect(component.ingredientsList).toBe(ingredients);
  });
});
