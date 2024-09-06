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
import es.jonay.kb.shopsystem.model.repository.IItemRepository;
import es.jonay.kb.shopsystem.model.repository.ITradeRepository;

@Controller
public class TradeController {
    private ITradeRepository tradeRepository;

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

    public TradeDto saveList(ArrayList<ItemDto> items){
        Trade trade = TradeMapper.INSTANCE.toTrade(new TradeDto(items, new Date())) ;
        return TradeMapper.INSTANCE.toTradeDto(tradeRepository.save(trade));
    }
    
    public void deleteById(Long id){
        tradeRepository.deleteById(id);
    }
}
