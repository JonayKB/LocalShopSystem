package es.jonay.kb.shopsystem.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import es.jonay.kb.shopsystem.model.entities.Item;

@Repository
public interface IItemRepository {
    List<Item> findAll();

    void deleteById(Long id);

    Optional<Item> findById(Long id);

    Item save(Item entity);
}

