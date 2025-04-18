import strawberry
from typing import List, Optional, Dict, Any
from app.models.menu_item import MenuItem
from app.core.database import get_db
import json

@strawberry.scalar(
    name="JSON",
    description="The `JSON` scalar type represents JSON values as Python objects",
    specified_by_url="http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf",
)
class JSON:
    @staticmethod
    def serialize(value: Any) -> str:
        return json.dumps(value)

    @staticmethod
    def parse_value(value: str) -> Any:
        return json.loads(value)

@strawberry.type
class MenuItemType:
    id: int
    name: str
    description: Optional[str] = None
    price: float
    imageUrl: Optional[str] = strawberry.field(default=None)
    category: Optional[str] = None
    canteenId: int = strawberry.field(default=None)
    isAvailable: bool = strawberry.field(default=True)
    isVegetarian: bool = strawberry.field(default=False)
    isFeatured: bool = strawberry.field(default=False)
    hasSizeVariations: bool = strawberry.field(default=False)
    sizeOptions: Optional[JSON] = None
    minQuantity: int = strawberry.field(default=1)
    maxQuantity: int = strawberry.field(default=10)
    preparationTime: int = strawberry.field(default=15)
    isVegan: bool = strawberry.field(default=False)
    isGlutenFree: bool = strawberry.field(default=False)
    allowsSpecialInstructions: bool = strawberry.field(default=True)
    specialInstructionsPrompt: Optional[str] = None
    calories: Optional[int] = None
    spiceLevel: int = strawberry.field(default=1)
    popularityScore: float = strawberry.field(default=0.0)
    averageRating: float = strawberry.field(default=0.0)
    totalRatings: int = strawberry.field(default=0)

@strawberry.type
class MenuQuery:
    @strawberry.field
    def get_menu_items(self) -> List[MenuItemType]:
        """Get all menu items"""
        db = next(get_db())
        db_menu_items = db.query(MenuItem).all()
        return [
            MenuItemType(
                id=item.id,
                name=item.name,
                description=item.description,
                price=item.price,
                imageUrl=item.image_url,
                category=item.category,
                canteenId=item.canteen_id,
                isAvailable=bool(item.is_available),
                isVegetarian=bool(item.is_vegetarian),
                isFeatured=bool(item.is_featured),
                hasSizeVariations=item.has_size_variations,
                sizeOptions=item.size_options,
                minQuantity=item.min_quantity,
                maxQuantity=item.max_quantity,
                preparationTime=item.preparation_time,
                isVegan=item.is_vegan,
                isGlutenFree=item.is_gluten_free,
                allowsSpecialInstructions=item.allows_special_instructions,
                specialInstructionsPrompt=item.special_instructions_prompt,
                calories=item.calories,
                spiceLevel=item.spice_level,
                popularityScore=item.popularity_score,
                averageRating=item.average_rating,
                totalRatings=item.total_ratings
            )
            for item in db_menu_items
        ]


    @strawberry.field
    def get_menu_items_by_canteen(self, canteen_id: int) -> List[MenuItemType]:
        """Get menu items by canteen ID"""
        db = next(get_db())
        canteen_items = db.query(MenuItem).filter(MenuItem.canteen_id == canteen_id).all()
        return [
            MenuItemType(
                id=item.id,
                name=item.name,
                description=item.description,
                price=item.price,
                imageUrl=item.image_url,
                category=item.category,
                canteenId=item.canteen_id,
                isAvailable=bool(item.is_available),
                isVegetarian=bool(item.is_vegetarian),
                isFeatured=bool(item.is_featured),
                hasSizeVariations=item.has_size_variations,
                sizeOptions=item.size_options,
                minQuantity=item.min_quantity,
                maxQuantity=item.max_quantity,
                preparationTime=item.preparation_time,
                isVegan=item.is_vegan,
                isGlutenFree=item.is_gluten_free,
                allowsSpecialInstructions=item.allows_special_instructions,
                specialInstructionsPrompt=item.special_instructions_prompt,
                calories=item.calories,
                spiceLevel=item.spice_level,
                popularityScore=item.popularity_score,
                averageRating=item.average_rating,
                totalRatings=item.total_ratings
            )
            for item in canteen_items
        ]
    @strawberry.field
    def get_featured_menu_items(self, canteen_id: int) -> List[MenuItemType]:
        """Get featured menu items for a specific canteen"""
        db = next(get_db())
        featured_items = (
            db.query(MenuItem)
            .filter(MenuItem.is_featured == 1, MenuItem.canteen_id == canteen_id)
            .all()
        )
        return [
            MenuItemType(
                id=item.id,
                name=item.name,
                description=item.description,
                price=item.price,
                imageUrl=item.image_url,
                category=item.category,
                canteenId=item.canteen_id,
                isAvailable=bool(item.is_available),
                isVegetarian=bool(item.is_vegetarian),
                isFeatured=bool(item.is_featured),
                hasSizeVariations=item.has_size_variations,
                sizeOptions=item.size_options,
                minQuantity=item.min_quantity,
                maxQuantity=item.max_quantity,
                preparationTime=item.preparation_time,
                isVegan=item.is_vegan,
                isGlutenFree=item.is_gluten_free,
                allowsSpecialInstructions=item.allows_special_instructions,
                specialInstructionsPrompt=item.special_instructions_prompt,
                calories=item.calories,
                spiceLevel=item.spice_level,
                popularityScore=item.popularity_score,
                averageRating=item.average_rating,
                totalRatings=item.total_ratings
            )
            for item in featured_items
        ]

    @strawberry.field
    def get_menu_items_by_category(self, category: str) -> List[MenuItemType]:
        """Get menu items by category"""
        db = next(get_db())
        category_items = db.query(MenuItem).filter(MenuItem.category == category).all()
        return [
            MenuItemType(
                id=item.id,
                name=item.name,
                description=item.description,
                price=item.price,
                imageUrl=item.image_url,
                category=item.category,
                canteenId=item.canteen_id,
                isAvailable=bool(item.is_available),
                isVegetarian=bool(item.is_vegetarian),
                isFeatured=bool(item.is_featured),
                hasSizeVariations=item.has_size_variations,
                sizeOptions=item.size_options,
                minQuantity=item.min_quantity,
                maxQuantity=item.max_quantity,
                preparationTime=item.preparation_time,
                isVegan=item.is_vegan,
                isGlutenFree=item.is_gluten_free,
                allowsSpecialInstructions=item.allows_special_instructions,
                specialInstructionsPrompt=item.special_instructions_prompt,
                calories=item.calories,
                spiceLevel=item.spice_level,
                popularityScore=item.popularity_score,
                averageRating=item.average_rating,
                totalRatings=item.total_ratings
            )
            for item in category_items
        ]

# Create query instances
queries = [
    strawberry.field(name="getMenuItems", resolver=MenuQuery.get_menu_items),
    strawberry.field(name="getFeaturedMenuItems", resolver=MenuQuery.get_featured_menu_items),
    strawberry.field(name="getMenuItemsByCanteen", resolver=MenuQuery.get_menu_items_by_canteen),
    strawberry.field(name="getMenuItemsByCategory", resolver=MenuQuery.get_menu_items_by_category)
]