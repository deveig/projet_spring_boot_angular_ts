package com.application.recipe;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
public class Ingredient {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    @NotNull
    @Size(max = 255)
    private String ingredient;

    @NotNull
    @Positive
    private int quantity;
    
    @NotNull
    @Size(max = 100)
    private String unit; 

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getIngredient() {
        return this.ingredient;
    }

    public void setIngredient(String ingredient) {
        this.ingredient = ingredient;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return this.unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public User getUser(){
        return this.user;
    }

    public void setUser(User user){
        this.user = user;
    }
    
    public String toString() {
		return "{\"id\":" + this.id + "," + "\"ingredient\":" + "\"" +  this.ingredient + "\"," + "\"quantity\":" + this.quantity + "," + "\"unit\":" + "\"" + this.unit + "\"," + "\"user\":" + this.user.toString() + "}";
	}
    
}