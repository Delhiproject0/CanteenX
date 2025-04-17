import strawberry
from typing import List, Optional
from datetime import datetime
from ..models.menu_item import MenuItem
from ..repositories.menu_repository import MenuRepository

@strawberry.type
class MenuItemType:
    id: int
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None
    is_available: bool = True
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_gluten_free: bool = False
    preparation_time: Optional[int] = 15
    canteen_id: int
    created_at: datetime
    updated_at: datetime

@strawberry.input
class MenuItemInput:
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None
    is_available: bool = True
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_gluten_free: bool = False
    preparation_time: int = 15
    canteen_id: int

@strawberry.type
class MenuQuery:
    @strawberry.field
    def get_menu_items_by_canteen(self, canteen_id: int) -> List[MenuItemType]:
        """Get all menu items for a specific canteen"""
        items = MenuRepository.get_all_menu_items(canteen_id)
        return [MenuItemType(**item.dict()) for item in items]

    @strawberry.field
    def get_menu_item(self, id: int) -> Optional[MenuItemType]:
        """Get a specific menu item by ID"""
        item = MenuRepository.get_menu_item(id)
        return MenuItemType(**item.dict()) if item else None

@strawberry.type
class MenuMutation:
    @strawberry.mutation
    def add_menu_item(self, input: MenuItemInput) -> MenuItemType:
        """Add a new menu item"""
        new_item = MenuItem(
            name=input.name,
            description=input.description,
            price=input.price,
            category=input.category,
            image_url=input.image_url,
            is_available=input.is_available,
            is_vegetarian=input.is_vegetarian,
            is_vegan=input.is_vegan,
            is_gluten_free=input.is_gluten_free,
            preparation_time=input.preparation_time,
            canteen_id=input.canteen_id
        )
        created_item = MenuRepository.create_menu_item(new_item)
        return MenuItemType(**created_item.dict())

    @strawberry.mutation
    def update_menu_item(self, id: int, input: MenuItemInput) -> Optional[MenuItemType]:
        """Update an existing menu item"""
        menu_item = MenuItem(
            id=id,
            name=input.name,
            description=input.description,
            price=input.price,
            category=input.category,
            image_url=input.image_url,
            is_available=input.is_available,
            is_vegetarian=input.is_vegetarian,
            is_vegan=input.is_vegan,
            is_gluten_free=input.is_gluten_free,
            preparation_time=input.preparation_time,
            canteen_id=input.canteen_id
        )
        updated_item = MenuRepository.update_menu_item(id, menu_item)
        return MenuItemType(**updated_item.dict()) if updated_item else None

    @strawberry.mutation
    def delete_menu_item(self, id: int) -> bool:
        """Delete a menu item"""
        # We'll use a fixed canteen_id for now, in production this would come from auth context
        canteen_id = 1
        return MenuRepository.delete_menu_item(id, canteen_id)

    @strawberry.mutation
    def update_menu_item_availability(self, id: int, is_available: bool) -> Optional[MenuItemType]:
        """Update menu item availability"""
        item = MenuRepository.get_menu_item(id)
        if not item:
            return None
        
        item.is_available = is_available
        updated_item = MenuRepository.update_menu_item(id, item)
        return MenuItemType(**updated_item.dict()) if updated_item else None