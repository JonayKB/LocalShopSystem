package es.jonay.kb.shopsystem.api.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import es.jonay.kb.shopsystem.api.dto.ItemDto;
import es.jonay.kb.shopsystem.model.entities.Category;
import es.jonay.kb.shopsystem.model.entities.Item;
import es.jonay.kb.shopsystem.model.repository.ICategoryRepository;

@Mapper
public interface ItemMapper{
    ItemMapper INSTANCE = Mappers.getMapper(ItemMapper.class);
    @Mapping(source = "category.id", target = "categoryId")
    public ItemDto toItemDto(Item item);

    public Item toItem(ItemDto itemDto);
}

