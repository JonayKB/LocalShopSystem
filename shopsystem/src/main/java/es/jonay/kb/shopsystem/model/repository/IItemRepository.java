package es.jonay.kb.shopsystem.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import es.jonay.kb.shopsystem.api.dto.ItemDto;
import es.jonay.kb.shopsystem.model.entities.Item;

@Repository
public interface IItemRepository extends JpaRepository<Item,Long> {
    List<Item> findAll();

    void deleteById(Long id);

    Optional<Item> findById(Long id);

    Item save(Item entity);

    List<Item> findByCategoryId(Long categoryId);

    List<Item> findByTradesId(Long tradesId);
}

