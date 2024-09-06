package es.jonay.kb.shopsystem.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import es.jonay.kb.shopsystem.model.entities.Item;
import es.jonay.kb.shopsystem.model.entities.Trade;

@Repository
public interface ITradeRepository extends JpaRepository<Trade,Long> {
    List<Trade> findAll();

    void deleteById(Long id);

    Optional<Trade> findById(Long id);

    Trade save(Trade entity);
}

