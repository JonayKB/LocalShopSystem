package es.jonay.kb.shopsystem.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import es.jonay.kb.shopsystem.api.dto.ItemDto;
import es.jonay.kb.shopsystem.controller.ItemController;
@RestController
@RequestMapping("item")

public class ItemService {
    ItemController iItemController;

    public ItemController getIItemController() {
        return this.iItemController;
    }

    @Autowired
    public void setIItemController(ItemController iItemController) {
        this.iItemController = iItemController;
    }

    @GetMapping("/")
    public List<ItemDto> getAll() {
        return iItemController.findAll();
    }

    @GetMapping("/{id}")
    public Optional<ItemDto> getById(@PathVariable(name = "id") final Long id) {
        return iItemController.findById(id);
    }

    @PostMapping("/")
    public ItemDto save(@RequestBody ItemDto entity) {
        return iItemController.save(entity);
    }

    @PostMapping("/int")
    public Integer pruebaInt(@RequestBody Integer entity) {
        return entity;
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable(name = "id") final Long id) {
        iItemController.deleteById(id);
    }
}
