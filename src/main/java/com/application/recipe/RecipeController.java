package com.application.recipe;

import java.io.IOException;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ExceptionHandler;

// Brings together @Controller and @ResponseBody.
@RestController
@RequestMapping("/recipe")
public class RecipeController {

    @Autowired
	private IngredientRepository ingredientRepository;

    // Sends all ingredients.
	@GetMapping("")
    public Iterable<Ingredient> getIngredients() {
        return ingredientRepository.findAll();
    }

    // Checks ingredient then saves it or not. 
	@PostMapping("") 
    @ExceptionHandler
    public Map<String, String> checkData(@RequestBody(required = true) Ingredient ingredient) throws IOException {
        Pattern pattern = Pattern.compile("\\D+");
            if (pattern.matcher(ingredient.getIngredient()).matches() && pattern.matcher(ingredient.getUnit()).matches()) {
                Ingredient newIngredient = new Ingredient();
                newIngredient.setIngredient(ingredient.getIngredient());
                newIngredient.setQuantity(ingredient.getQuantity());
                newIngredient.setUnit(ingredient.getUnit());
                ingredientRepository.save(newIngredient);
                return Map.of("message", "Data are saved.");
            } else {
                throw new IOException();
            }
    }
}