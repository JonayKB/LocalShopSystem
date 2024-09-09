package es.jonay.kb.shopsystem.services;

import java.util.ArrayList;
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
import es.jonay.kb.shopsystem.api.dto.TradeDto;
import es.jonay.kb.shopsystem.controller.ItemController;
import es.jonay.kb.shopsystem.controller.TradeController;

@RestController
@RequestMapping("trade")
public class TradeService {
    TradeController tradeController;

    public TradeController getTradeController() {
        return this.tradeController;
    }

    @Autowired
    public void setTradeController(TradeController tradeController) {
        this.tradeController = tradeController;
    }

    @GetMapping("/")
    public List<TradeDto> getAll() {
        return tradeController.findAll();
    }

    @GetMapping("/{id}")
    public Optional<TradeDto> getById(@PathVariable(name = "id") final Long id) {
        return tradeController.findById(id);
    }

    @PostMapping("/")
    public TradeDto save(@RequestBody TradeDto entity) {
        return tradeController.save(entity);
    }

    @PostMapping("/newTrade")
    public TradeDto saveList(@RequestBody ArrayList<ItemDto> items) {
        return tradeController.saveList(items);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable(name = "id") final Long id) {
        tradeController.deleteById(id);
    }
}