package com.application.recipe;

import java.util.Iterator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
public class RecipeBehaviorTest {

    // Creates and injects a mock for the `IngredientRepository`. 
    @MockBean
    private IngredientRepository ingredientRepository;

    @Test
    public void shouldReturnAddedIngredient() throws Exception {
        Ingredient ingredient = new Ingredient();
        ingredient.setIngredient("oil");
        ingredient.setQuantity(Integer.valueOf(10));
        ingredient.setUnit("cl");
        ingredientRepository.save(ingredient);
        Iterable<Ingredient> ingredients = ingredientRepository.findAll();
        Iterator<Ingredient> iterator = ingredients.iterator();
        // Iterates over `ingredients` to assert that it element is `ingredient`.
        while (iterator.hasNext()) {

            Object element = iterator.next();
            assertEquals(element, ingredient);
        }
    }

}