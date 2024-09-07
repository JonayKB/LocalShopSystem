package es.jonay.kb.shopsystem.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import es.jonay.kb.shopsystem.api.dto.ItemDto;
import es.jonay.kb.shopsystem.api.dto.TradeDto;
import es.jonay.kb.shopsystem.api.mappers.ItemMapper;
import es.jonay.kb.shopsystem.api.mappers.TradeMapper;
import es.jonay.kb.shopsystem.model.entities.Item;
import es.jonay.kb.shopsystem.model.entities.Trade;
import es.jonay.kb.shopsystem.model.repository.ICategoryRepository;
import es.jonay.kb.shopsystem.model.repository.IItemRepository;
import es.jonay.kb.shopsystem.model.repository.ITradeRepository;

@Controller
public class TradeController {
    private ITradeRepository tradeRepository;
    private ICategoryRepository categoryRepository;

    @Autowired
    public void setIICategoryRepository(ICategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public ICategoryRepository getICategoryRepository() {
        return this.categoryRepository;
    }
    public ITradeRepository getITradeRepository() {
        return this.tradeRepository;
    }
    @Autowired
    public void setITradeRepository(ITradeRepository tradeRepository) {
        this.tradeRepository = tradeRepository;
    }

    public List<TradeDto> findAll(){
        List<Trade> trades = tradeRepository.findAll();
        List<TradeDto> result = new ArrayList<TradeDto>();
        for(Trade trade : trades){
            result.add(TradeMapper.INSTANCE.toTradeDto(trade));
        }
        return result;
    }

    public Optional<TradeDto> findById(Long id){
        Optional<Trade> trade = tradeRepository.findById(id);
        return trade.map(TradeMapper.INSTANCE::toTradeDto);
    }

    public TradeDto save(TradeDto tradeDto){
        Trade trade = TradeMapper.INSTANCE.toTrade(tradeDto);
        return TradeMapper.INSTANCE.toTradeDto(tradeRepository.save(trade));
    }

    public TradeDto saveList(ArrayList<ItemDto> itemsDto){
        
        List<Item> itemList = new ArrayList<Item>();
        for(ItemDto itemDto : itemsDto){
            Item item = ItemMapper.INSTANCE.toItem(itemDto);
            item.setCategory(categoryRepository.findById(itemDto.getCategoryId()).get());
            itemList.add(item);
        }
        Trade trade = new Trade() ;
        trade.setDate(new Date());
        trade.setItems(itemList);
        return TradeMapper.INSTANCE.toTradeDto(tradeRepository.save(trade));
    }
    
    public void deleteById(Long id){
        tradeRepository.deleteById(id);
    }
}
