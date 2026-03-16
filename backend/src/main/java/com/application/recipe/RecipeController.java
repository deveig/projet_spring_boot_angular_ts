package com.application.recipe;

import java.io.IOException;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

import jakarta.validation.ConstraintViolationException;

// Brings together @Controller and @ResponseBody.
@RestController
@RequestMapping("/recipe")
public class RecipeController {

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private UserRepository userRepository;

    // Checks ingredient then saves it or not.
    @PostMapping("/user")
    public ResponseEntity<Map<String, ?>> checkUser(@RequestBody(required = true) User newUser) throws IOException {
        Pattern patternIsString = Pattern.compile("\\D+");

        if (patternIsString.matcher(newUser.getUserName()).matches()) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
            String password = encoder.encode(newUser.getUserName());
            newUser.setPassword(password);
            
            userRepository.save(newUser);
            User user =  userRepository.findByPassword(newUser.getPassword()); //JWT
            // httpSession.setAttribute("user", user); 
            return ResponseEntity.ok().body(Map.of("token", user));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Enter your name."));
        }
    }

    // Sends user.
    @GetMapping("/user")
    public ResponseEntity<Map<String, ?>> getUser(@RequestHeader("Authorization") String token) throws IOException {
    Gson gson = new Gson();
    token = token.split("Bearer ")[1];
    if (token.contains("\\")) {
        token = token.replace("\"", "");
        token = token.replace("\\", "\"");
    }
    User userToken = gson.fromJson(token, User.class);
    User user = userRepository.findByPassword(userToken.getPassword());
    if(user != null){
    return ResponseEntity.ok().body(Map.of("token", user));
    } else {
    return ResponseEntity.badRequest().body(Map.of("message", "Bad request."));
    }

    }

    // Sends all ingredients.
    @GetMapping("")
    public ResponseEntity<Map<String, ?>> getIngredients(@RequestHeader("Authorization") String token)
            throws IOException {
        // User user = (User) httpSession.getAttribute("user");
        Gson gson = new Gson();
        token = token.split("Bearer ")[1];
        if (token.contains("\\")) {
            token = token.replace("\"", "");
            token = token.replace("\\", "\"");
        }
        User userToken = gson.fromJson(token, User.class);
        User user = userRepository.findByPassword(userToken.getPassword());
        if (user != null) {
            return ResponseEntity.ok().body(Map.of("ingredientsList", ingredientRepository.findByUser(user)));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid data."));
        }

    }

    // Handles 'HttpMessageNotReadableException' and 'ConstraintViolationException'
    // throwing when there is a constraint validation failed.
    @ExceptionHandler({ HttpMessageNotReadableException.class, ConstraintViolationException.class })
    public ResponseEntity<Map<String, String>> handle(Exception exception) {
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid data."));
    }

    // Checks ingredient then saves it or not.
    @PostMapping("")
    public ResponseEntity<Map<String, String>> checkData(@RequestHeader("Authorization") String token,
            @RequestBody(required = true) Ingredient ingredient) throws IOException {
        // User user = (User) httpSession.getAttribute("user");
        Gson gson = new Gson();
        token = token.split("Bearer ")[1];

        if (token.contains("\\")) {
            token = token.replace("\"", "");
            token = token.replace("\\", "\"");
        }
        User userToken = gson.fromJson(token, User.class);
        User user = userRepository.findByPassword(userToken.getPassword());
        if (user != null) {
            Pattern patternIsString = Pattern.compile("\\D+");
            if (patternIsString.matcher(ingredient.getIngredient()).matches()
                    && patternIsString.matcher(ingredient.getUnit()).matches()) {
                Ingredient newIngredient = new Ingredient();
                newIngredient.setIngredient(ingredient.getIngredient());
                newIngredient.setQuantity(ingredient.getQuantity());
                newIngredient.setUnit(ingredient.getUnit());
                newIngredient.setUser(user);
                ingredientRepository.save(newIngredient);
                return ResponseEntity.ok().body(Map.of("message", "Data is saved."));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid data."));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Enter your name."));
        }
    }

    // Removes the last ingredient if there is one.
    @DeleteMapping("")
    public ResponseEntity<Map<String, String>> deleteData(@RequestHeader("Authorization") String token)
            throws IOException {
        // User user = (User) httpSession.getAttribute("user");
        Gson gson = new Gson();
        token = token.split("Bearer ")[1];

        if (token.contains("\\")) {
            token = token.replace("\"", "");
            token = token.replace("\\", "\"");
        }
        User userToken = gson.fromJson(token, User.class);
        User user = userRepository.findByPassword(userToken.getPassword());
        if (user != null) {
            Iterable<Ingredient> ingredients = ingredientRepository.findByUser(user);
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
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Enter your name."));
        }
    }

}