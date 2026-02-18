package com.application.recipe;

import java.io.IOException;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.ConstraintViolationException;

// Brings together @Controller and @ResponseBody.
@RestController
@RequestMapping("/recipe")
@CrossOrigin(origins = "*", allowCredentials = "true", allowedHeaders = "*")
public class RecipeController {

    @Autowired
	private IngredientRepository ingredientRepository;

    // Sends all ingredients.
	@GetMapping("")
    public ResponseEntity<Iterable<Ingredient>> getIngredients() throws IOException {
        return ResponseEntity.ok().body(ingredientRepository.findAll());
    }

    // Handles 'HttpMessageNotReadableException' and 'ConstraintViolationException' throwing when there is a constraint validation failed.
    @ExceptionHandler({HttpMessageNotReadableException.class, ConstraintViolationException.class})
    public ResponseEntity<Map<String, String>> handle(Exception exception) {
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid data."));
    }

    // Checks ingredient then saves it or not. 
	@PostMapping("")
    public ResponseEntity<Map<String, String>> checkData(@RequestBody(required = true) Ingredient ingredient) throws IOException {
        Pattern patternIsString = Pattern.compile("\\D+");
        if (patternIsString.matcher(ingredient.getIngredient()).matches() && patternIsString.matcher(ingredient.getUnit()).matches()) {
            Ingredient newIngredient = new Ingredient();
            newIngredient.setIngredient(ingredient.getIngredient());
            newIngredient.setQuantity(ingredient.getQuantity());
            newIngredient.setUnit(ingredient.getUnit());
            ingredientRepository.save(newIngredient);
            return ResponseEntity.ok().body(Map.of("message", "Data is saved."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid data."));
        }
    }

    // Removes the last ingredient if there is one.
    @DeleteMapping("")
    public ResponseEntity<Map<String, String>> deleteData() throws IOException {
        Iterable<Ingredient> ingredients = ingredientRepository.findAll();
        int count = 0;
        Ingredient lastIngredient = new Ingredient();
        for (Ingredient ingredient : ingredients) {
            lastIngredient = ingredient;
            count++;
        }
        if (count > 0) {
            ingredientRepository.delete(lastIngredient);
            return ResponseEntity.ok().body(Map.of("message", "Data is deleted."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "No ingredient to delete."));
        }
    }
    
}