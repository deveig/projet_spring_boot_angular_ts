package com.application.recipe;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@SpringBootTest
public class RecipeBehaviorTest {
  
    private MockMvc mockMvc;

    // private MockHttpSession mockSession;

    @Autowired
	private RecipeController recipeController;

    // Creates and injects a mock for `IngredientRepository` and `UserRepository`.
    @MockBean
    private IngredientRepository ingredientRepository;
    @MockBean
    private UserRepository userRepository;

    @BeforeEach
	void setup() {
		this.mockMvc = MockMvcBuilders.standaloneSetup(recipeController).build();
        // this.mockSession = new MockHttpSession();
	}

    @Test
    public void recipeShouldReturnATokenForPostRequestWithValidUser() throws Exception{
        // Arranges
        String userName = "sam";
        User user = new User();
        user.setUserName(userName);

        User savedUser = new User();
        savedUser.setUserName(userName);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
        String password = encoder.encode(savedUser.getUserName());
        savedUser.setPassword(password);
        // this.mockSession.setAttribute("user", new User());
        // User savedUser = new User();
        // //savedUser.setId(1);
        // savedUser.setUserName(newUser.getUserName());
        // savedUser.setPassword(newUser.getPassword());
        String tokenToString = "{\"token\":" + savedUser.toString() + "}";
        when(userRepository.save(argThat(u -> u.getPassword().length() > 0))).thenReturn(savedUser);
        when(userRepository.findByPassword(argThat(p -> p.length() > 0))).thenReturn(savedUser);
        // Acts
        this.mockMvc.perform(post("/recipe/user").contentType("application/json").content(user.toString()))
        // Asserts
            .andDo(print())
            // Asserts ""
            .andExpect(status().isOk())
            // Asserts
            .andExpect(content().string(tokenToString));
    }

    // @Test
    public void recipeShouldReturnListOfIngredients() throws Exception {
        // Arranges
        List<Ingredient> ingredientList = new ArrayList<Ingredient>(1);
        Ingredient ingredient = new Ingredient();
        ingredient.setId(1);
        ingredient.setIngredient("oil");
        ingredient.setQuantity(Integer.valueOf(10));
        ingredient.setUnit("cl");
        User user = new User();
        user.setId(1);
        user.setUserName("sam");
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
        String password = encoder.encode(user.getUserName());
        user.setPassword(password);
        ingredient.setUser(user);
        ingredientList.add(ingredient);
        String ingredientListToString = "{\"ingredientsList\":"+ ingredientList.toString() + "}";
        // this.mockSession.setAttribute("user", user);
        when(userRepository.findByPassword(argThat(p -> p.length() > 0))).thenReturn(user);
        when(ingredientRepository.findByUser(argThat(u -> u.getId() > 0))).thenReturn(ingredientList);
        
        // Acts
        this.mockMvc.perform(get("/recipe").header("Authorization", "Bearer " + user.toString()))
            // Asserts
            .andDo(print())
            // Asserts
            .andExpect(status().isOk())
            // Asserts
            .andExpect(content().string(ingredientListToString));
    }   

    @Test
    public void recipeShouldReturnAMessageForPostRequestWithValidIngredient() throws Exception {
        // Arranges
        Ingredient ingredient = new Ingredient();
        ingredient.setIngredient("oil");
        ingredient.setQuantity(Integer.valueOf(10));
        ingredient.setUnit("cl");
        User user = new User();
        user.setId(1);
        user.setUserName("sam");
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
        String password = encoder.encode(user.getUserName());
        user.setPassword(password);
        ingredient.setUser(user);
        // this.mockSession.setAttribute("user", user);
        when(userRepository.findByPassword(argThat(p -> p.length() > 0))).thenReturn(user);
        when(ingredientRepository.save(ingredient)).thenReturn(ingredient);
        // Acts
        this.mockMvc.perform(post("/recipe").header("Authorization", "Bearer " + user.toString()).contentType("application/json").content(ingredient.toString()))
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
        User user = new User();
        user.setId(1);
        user.setUserName("sam");
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
        String password = encoder.encode(user.getUserName());
        user.setPassword(password);
        ingredient.setUser(user);
        when(userRepository.findByPassword(argThat(p -> p.length() > 0))).thenReturn(user);
        // this.mockSession.setAttribute("user", user);
        // Acts
        this.mockMvc.perform(post("/recipe").header("Authorization", "Bearer " + user.toString()).contentType("application/json").content(ingredient.toString()))
            // Asserts
            .andDo(print())
            // Asserts
            .andExpect(status().is(400))
            // Asserts
            .andExpect(content().string(containsString("Invalid data.")));
    }

    @Test
    public void recipeShouldReturnAMessageForDeleteRequest() throws Exception {
        // Arranges
        List<Ingredient> ingredientsList = new ArrayList<Ingredient>(1);
        Ingredient newIngredient = new Ingredient();
        newIngredient.setId(1);
        newIngredient.setIngredient("oil");
        newIngredient.setQuantity(Integer.valueOf(10));
        newIngredient.setUnit("cl");
        User user = new User();
        user.setId(1);
        user.setUserName("sam");
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
        String password = encoder.encode(user.getUserName());
        user.setPassword(password);
        newIngredient.setUser(user);
        ingredientsList.add(newIngredient);
        // this.mockSession.setAttribute("user", user);
        when(userRepository.findByPassword(argThat(p -> p.length() > 0))).thenReturn(user);
        when(ingredientRepository.findByUser(argThat(u -> u.getId() > 0))).thenReturn(ingredientsList);
        Ingredient lastIngredient = new Ingredient();
        for (Ingredient ingredient : ingredientsList) {
            lastIngredient = ingredient;
        }
        doNothing().when(ingredientRepository).delete(lastIngredient);
        // Acts
        this.mockMvc.perform(delete("/recipe").header("Authorization", "Bearer " + user.toString()))
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
        List<Ingredient> ingredientsList = new ArrayList<Ingredient>(0);

        User user = new User();
        user.setId(1);
        user.setUserName("sam");
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
        String password = encoder.encode(user.getUserName());
        user.setPassword(password);

        // this.mockSession.setAttribute("user", new User());
        when(userRepository.findByPassword(argThat(p -> p.length() > 0))).thenReturn(user);
        when(ingredientRepository.findByUser(argThat(u -> u.getId() > 0))).thenReturn(ingredientsList);
        // Acts
        this.mockMvc.perform(delete("/recipe").header("Authorization", "Bearer "+user.toString()))
            // Asserts
            .andDo(print())
            // Asserts
            .andExpect(status().is(400))
            // Asserts
            .andExpect(content().string(containsString("No ingredient to delete.")));
    }
    
}