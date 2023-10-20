package com.application.recipe;

import java.util.ArrayList;
import java.util.Collection;

import static org.hamcrest.Matchers.containsString;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
public class RecipeBehaviorTest {
  
    private MockMvc mockMvc;

    @Autowired
	private RecipeController recipeController;

    // Creates and injects a mock for `IngredientRepository`.
    @MockBean
    private IngredientRepository ingredientRepository;

    @BeforeEach
	void setup() {
		this.mockMvc = MockMvcBuilders.standaloneSetup(recipeController).build();
	}

    @Test
    public void recipeShouldReturnListOfIngredients() throws Exception {
        // Arranges
        Collection<Ingredient> ingredientsList = new ArrayList<Ingredient>(1);
        Ingredient ingredient = new Ingredient();
        ingredient.setId(1);
        ingredient.setIngredient("oil");
        ingredient.setQuantity(Integer.valueOf(10));
        ingredient.setUnit("cl");
        ingredientsList.add(ingredient);
        String ingredientsListToString = "[" + ingredient.toString() + "]";
        when(ingredientRepository.findAll()).thenReturn(ingredientsList);
        // Acts
        this.mockMvc.perform(get("/recipe"))
            // Asserts
            .andDo(print())
            // Asserts
            .andExpect(status().isOk())
            // Asserts
            .andExpect(content().string(ingredientsListToString));
    }   

    @Test
    public void recipeShouldReturnAMessageForPostRequestWithValidIngredient() throws Exception {
        // Arranges
        Ingredient ingredient = new Ingredient();
        ingredient.setIngredient("oil");
        ingredient.setQuantity(Integer.valueOf(10));
        ingredient.setUnit("cl");
        when(ingredientRepository.save(ingredient)).thenReturn(ingredient);
        // Acts
        this.mockMvc.perform(post("/recipe").contentType("application/json").content(ingredient.toString()))
            // Asserts
            .andDo(print())
            // Asserts
            .andExpect(status().isOk())
            // Asserts
            .andExpect(content().string(containsString("Data is saved.")));
    }

    @Test
    public void recipeShouldReturnAMessageForPostRequestWithInvalidIngredient() throws Exception {
        // Arranges
        Ingredient ingredient = new Ingredient();
        ingredient.setIngredient("oil10");
        ingredient.setQuantity(Integer.valueOf(10));
        ingredient.setUnit("cl");
        // Acts
        this.mockMvc.perform(post("/recipe").contentType("application/json").content(ingredient.toString()))
            // Asserts
            .andDo(print())
            // Asserts
            .andExpect(status().isOk())
            // Asserts
            .andExpect(content().string(containsString("Invalid data.")));
    }

    @Test
    public void recipeShouldReturnAMessageForDeleteRequest() throws Exception {
        // Arranges
        Collection<Ingredient> ingredientsList = new ArrayList<Ingredient>(1);
        Ingredient newIngredient = new Ingredient();
        newIngredient.setId(1);
        newIngredient.setIngredient("oil");
        newIngredient.setQuantity(Integer.valueOf(10));
        newIngredient.setUnit("cl");
        ingredientsList.add(newIngredient);
        when(ingredientRepository.findAll()).thenReturn(ingredientsList);
        Ingredient lastIngredient = new Ingredient();
        for (Ingredient ingredient : ingredientsList) {
            lastIngredient = ingredient;
        }
        doNothing().when(ingredientRepository).delete(lastIngredient);
        // Acts
        this.mockMvc.perform(delete("/recipe"))
            // Asserts
            .andDo(print())
            // Asserts
            .andExpect(status().isOk())
            // Asserts
            .andExpect(content().string(containsString("Data is deleted.")));
    }

    @Test
    public void recipeShouldReturnAMessageForDeleteRequestWhenNoIngredient() throws Exception {
        // Arranges
        Collection<Ingredient> ingredientsList = new ArrayList<Ingredient>(0);

        when(ingredientRepository.findAll()).thenReturn(ingredientsList);
        // Acts
        this.mockMvc.perform(delete("/recipe"))
            // Asserts
            .andDo(print())
            // Asserts
            .andExpect(status().isOk())
            // Asserts
            .andExpect(content().string(containsString("No ingredient to delete.")));
    }
    
}