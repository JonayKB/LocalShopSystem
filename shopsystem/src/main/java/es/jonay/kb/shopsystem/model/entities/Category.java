package es.jonay.kb.shopsystem.model.entities;

import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.Objects;
@Entity
@Table(name = "Categories")
public class Category {
    private static final long serialVersionUID = -3946522083L;

    @Id
    private Long categoryId;
    private String name;
    @OneToMany(mappedBy = "category")
    private Set<Item> items;

    public Category() {
    }

    public Category(Long categoryId, String name, Set<Item> items) {
        this.categoryId = categoryId;
        this.name = name;
        this.items = items;
    }
    public Category(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getCategoryId() {
        return this.categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Item> getItems() {
        return this.items;
    }

    public void setItems(Set<Item> items) {
        this.items = items;
    }


    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Category)) {
            return false;
        }
        Category category = (Category) o;
        return Objects.equals(categoryId, category.categoryId) ;
    }

    @Override
    public int hashCode() {
        return Objects.hash(categoryId);
    }

    @Override
    public String toString() {
        return "{" +
            " categoryId='" + getCategoryId() + "'" +
            ", name='" + getName() + "'" +
            ", items='" + getItems() + "'" +
            "}";
    }

}
