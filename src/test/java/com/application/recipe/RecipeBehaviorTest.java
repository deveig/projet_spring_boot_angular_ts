package com.application.recipe;

import java.util.ArrayList;
import java.util.Collection;

import static org.hamcrest.Matchers.containsString;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.when;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
    public void recipeShouldReturnAMessage() throws Exception {
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
            .andExpect(content().string(containsString("Data are saved.")));
    }
}