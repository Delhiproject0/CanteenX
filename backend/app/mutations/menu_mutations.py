import strawberry
from typing import Optional
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.menu_item import MenuItem
from app.models.canteen import Canteen
import json

@strawberry.type
class MenuItemMutationResponse:
    success: bool
    message: str

@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_menu_item(
        self,
        user_email: str,
        name: str,
        price: float,
        canteen_id: int,
        description: Optional[str] = None,
        image_url: Optional[str] = None,
        category: Optional[str] = None,
        is_vegetarian: Optional[bool] = None,
        is_featured: Optional[bool] = None,
    ) -> MenuItemMutationResponse:
        """Create a new menu item if the user has permission"""
        db = next(get_db())
        
        # Get the canteen to verify permissions
        canteen = db.query(Canteen).filter(Canteen.id == canteen_id).first()
        if not canteen:
            return MenuItemMutationResponse(success=False, message="Canteen not found")
            
        # Check if user has permission (email matches canteen email)
        if canteen.email != user_email:
            return MenuItemMutationResponse(success=False, message="Unauthorized: You don't have permission to add items to this canteen")
            
        # Create the new menu item
        new_item = MenuItem(
            name=name,
            price=price,
            canteen_id=canteen_id,
            description=description,
            image_url=image_url,
            category=category,
            is_vegetarian=1 if is_vegetarian else 0,
            is_featured=1 if is_featured else 0,
            is_available=1  # New items are available by default
        )
        
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        
        return MenuItemMutationResponse(success=True, message=f"Menu item '{name}' created successfully")

    @strawberry.mutation
    def update_menu_item_price(self, item_id: int, price: float, user_email: str) -> MenuItemMutationResponse:
        """Update the price of a menu item if the user has permission"""
        db = next(get_db())
        
        # Find the menu item
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
        if not menu_item:
            return MenuItemMutationResponse(success=False, message="Menu item not found")
            
        # Get the canteen associated with the item
        canteen = db.query(Canteen).filter(Canteen.id == menu_item.canteen_id).first()
        if not canteen:
            return MenuItemMutationResponse(success=False, message="Canteen not found")
            
        # Check if user has permission (email matches canteen email)
        if canteen.email != user_email:
            return MenuItemMutationResponse(success=False, message="Unauthorized: You don't have permission to update this item")
            
        # Update the price
        menu_item.price = price
        db.commit()
        
        return MenuItemMutationResponse(success=True, message="Price updated successfully")

    @strawberry.mutation
    def update_menu_item_availability(self, item_id: int, is_available: bool, user_email: str) -> MenuItemMutationResponse:
        """Update the availability of a menu item if the user has permission"""
        db = next(get_db())
        
        # Find the menu item
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
        if not menu_item:
            return MenuItemMutationResponse(success=False, message="Menu item not found")
            
        # Get the canteen associated with the item
        canteen = db.query(Canteen).filter(Canteen.id == menu_item.canteen_id).first()
        if not canteen:
            return MenuItemMutationResponse(success=False, message="Canteen not found")
            
        # Check if user has permission (email matches canteen email)
        if canteen.email != user_email:
            return MenuItemMutationResponse(success=False, message="Unauthorized: You don't have permission to update this item")
            
        # Update the availability
        menu_item.is_available = 1 if is_available else 0
        db.commit()
        
        return MenuItemMutationResponse(success=True, message="Availability updated successfully")

    @strawberry.mutation
    def delete_menu_item(
        self,
        item_id: int,
        user_email: str
    ) -> MenuItemMutationResponse:
        """Delete a menu item if the user has permission"""
        db = next(get_db())
        
        # Find the menu item
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
        if not menu_item:
            return MenuItemMutationResponse(success=False, message="Menu item not found")
            
        # Get the canteen associated with the item
        canteen = db.query(Canteen).filter(Canteen.id == menu_item.canteen_id).first()
        if not canteen:
            return MenuItemMutationResponse(success=False, message="Canteen not found")
            
        # Check if user has permission (email matches canteen email)
        if canteen.email != user_email:
            return MenuItemMutationResponse(success=False, message="Unauthorized: You don't have permission to delete this item")
            
        # Delete the menu item
        db.delete(menu_item)
        db.commit()
        
        return MenuItemMutationResponse(success=True, message=f"Menu item '{menu_item.name}' deleted successfully")

    @strawberry.mutation
    def toggle_featured_status(
        self,
        item_id: int,
        user_email: str
    ) -> MenuItemMutationResponse:
        """Toggle the featured status of a menu item"""
        db = next(get_db())
        
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
        if not menu_item:
            return MenuItemMutationResponse(success=False, message="Menu item not found")
            
        canteen = db.query(Canteen).filter(Canteen.id == menu_item.canteen_id).first()
        if not canteen:
            return MenuItemMutationResponse(success=False, message="Canteen not found")
            
        if canteen.email != user_email:
            return MenuItemMutationResponse(success=False, message="Unauthorized: You don't have permission to update this item")
            
        # Toggle the featured status
        menu_item.is_featured = 0 if menu_item.is_featured == 1 else 1
        db.commit()
        
        status = "featured" if menu_item.is_featured == 1 else "unfeatured"
        return MenuItemMutationResponse(success=True, message=f"Menu item {status} successfully")

    @strawberry.mutation
    def update_preparation_time(
        self,
        item_id: int,
        preparation_time: int,
        user_email: str
    ) -> MenuItemMutationResponse:
        """Update the preparation time of a menu item"""
        db = next(get_db())
        
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
        if not menu_item:
            return MenuItemMutationResponse(success=False, message="Menu item not found")
            
        canteen = db.query(Canteen).filter(Canteen.id == menu_item.canteen_id).first()
        if not canteen:
            return MenuItemMutationResponse(success=False, message="Canteen not found")
            
        if canteen.email != user_email:
            return MenuItemMutationResponse(success=False, message="Unauthorized: You don't have permission to update this item")
            
        menu_item.preparation_time = preparation_time
        db.commit()
        
        return MenuItemMutationResponse(success=True, message=f"Preparation time updated to {preparation_time} minutes")

    @strawberry.mutation
    def update_size_variations(
        self,
        item_id: int,
        size_options: str,  # JSON string
        user_email: str
    ) -> MenuItemMutationResponse:
        """Update the size variations and pricing for a menu item"""
        db = next(get_db())
        
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
        if not menu_item:
            return MenuItemMutationResponse(success=False, message="Menu item not found")
            
        canteen = db.query(Canteen).filter(Canteen.id == menu_item.canteen_id).first()
        if not canteen:
            return MenuItemMutationResponse(success=False, message="Canteen not found")
            
        if canteen.email != user_email:
            return MenuItemMutationResponse(success=False, message="Unauthorized: You don't have permission to update this item")
        
        try:
            # Validate JSON format
            variations = json.loads(size_options)
            menu_item.size_options = size_options
            menu_item.has_size_variations = bool(variations)  # Set to True if variations exist
            db.commit()
            return MenuItemMutationResponse(success=True, message="Size variations updated successfully")
        except json.JSONDecodeError:
            return MenuItemMutationResponse(success=False, message="Invalid JSON format for size variations")

mutations = [
    strawberry.field(name="createMenuItem", resolver=Mutation.create_menu_item),
    strawberry.field(name="updateMenuItemPrice", resolver=Mutation.update_menu_item_price),
    strawberry.field(name="updateMenuItemAvailability", resolver=Mutation.update_menu_item_availability),
    strawberry.field(name="deleteMenuItem", resolver=Mutation.delete_menu_item),
    strawberry.field(name="toggleFeaturedStatus", resolver=Mutation.toggle_featured_status),
    strawberry.field(name="updatePreparationTime", resolver=Mutation.update_preparation_time),
    strawberry.field(name="updateSizeVariations", resolver=Mutation.update_size_variations)
]