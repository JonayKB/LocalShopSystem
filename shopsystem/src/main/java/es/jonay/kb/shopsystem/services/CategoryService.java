package es.jonay.kb.shopsystem.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import es.jonay.kb.shopsystem.api.dto.CategoryDto;
import es.jonay.kb.shopsystem.api.dto.ItemDto;
import es.jonay.kb.shopsystem.controller.CategoryController;
import es.jonay.kb.shopsystem.controller.ItemController;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("category")
@CrossOrigin(origins = "*", methods = {RequestMethod.POST,RequestMethod.GET,RequestMethod.PUT,RequestMethod.DELETE})
public class CategoryService {
    CategoryController categoryController;

    public CategoryController getCategoryController() {
        return this.categoryController;
    }

    @Autowired
    public void setCategoryController(CategoryController categoryController) {
        this.categoryController = categoryController;
    }

    @GetMapping("/")
    public List<CategoryDto> getAll() {
        return categoryController.findAll();
    }

    @GetMapping("/{id}")
    public CategoryDto getById(@PathVariable(name = "id") final Long id) {

        return categoryController.findById(id).orElse(null);
    }

    @PostMapping("/")
    public CategoryDto save(@RequestBody CategoryDto entity) {
        return categoryController.save(entity);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable(name = "id") final Long id) {
        categoryController.deleteById(id);
    }
}
