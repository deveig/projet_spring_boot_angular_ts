package com.application.recipe;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RecipeApplicationTest {

	@Autowired
	private RecipeController recipeController;

	// Asserts that the application context start and it creates the controller.
	@Test
	public void loadContext() throws Exception {
		assertThat(recipeController).isNotNull();
	}

}
