from typing import List, Optional
from ..db import get_db_cursor
from  ..models.menu_item import MenuItem
from datetime import datetime

class MenuRepository:
    @staticmethod
    def get_all_menu_items(canteen_id: int) -> List[MenuItem]:
        """Get all menu items for a canteen"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, name, description, price, category, is_available, 
                       canteen_id, image_url, created_at, 
                       CURRENT_TIMESTAMP as updated_at
                FROM menu_items
                WHERE canteen_id = %s
                ORDER BY category, name
                """, 
                (canteen_id,)
            )
            rows = cursor.fetchall()
            # Add default values for fields that don't exist in the database
            for row in rows:
                row['is_vegetarian'] = False
                row['is_vegan'] = False
                row['is_gluten_free'] = False
                row['preparation_time'] = 15
            return [MenuItem(**row) for row in rows]

    @staticmethod
    def get_menu_item(item_id: int) -> Optional[MenuItem]:
        """Get a menu item by ID"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, name, description, price, category, is_available, 
                       canteen_id, image_url, created_at,
                       CURRENT_TIMESTAMP as updated_at
                FROM menu_items
                WHERE id = %s
                """, 
                (item_id,)
            )
            row = cursor.fetchone()
            if row:
                # Add default values for fields that don't exist in the database
                row['is_vegetarian'] = False
                row['is_vegan'] = False
                row['is_gluten_free'] = False
                row['preparation_time'] = 15
                return MenuItem(**row)
            return None

    @staticmethod
    def create_menu_item(menu_item: MenuItem) -> MenuItem:
        """Create a new menu item"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO menu_items (
                    name, description, price, category, image_url,
                    is_available, canteen_id, created_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s
                ) RETURNING id, name, description, price, category, is_available, 
                           canteen_id, image_url, created_at
                """,
                (
                    menu_item.name, menu_item.description, menu_item.price,
                    menu_item.category, menu_item.image_url, menu_item.is_available,
                    menu_item.canteen_id, menu_item.created_at
                )
            )
            row = cursor.fetchone()
            if row:
                # Add default values for fields that don't exist in the database
                row['is_vegetarian'] = menu_item.is_vegetarian
                row['is_vegan'] = menu_item.is_vegan
                row['is_gluten_free'] = menu_item.is_gluten_free
                row['preparation_time'] = menu_item.preparation_time
                row['updated_at'] = datetime.now()
            return MenuItem(**row)

    @staticmethod
    def update_menu_item(item_id: int, menu_item: MenuItem) -> Optional[MenuItem]:
        """Update an existing menu item"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                UPDATE menu_items SET
                    name = %s, 
                    description = %s, 
                    price = %s, 
                    category = %s,
                    image_url = %s, 
                    is_available = %s
                WHERE id = %s AND canteen_id = %s
                RETURNING id, name, description, price, category, is_available, 
                          canteen_id, image_url, created_at
                """,
                (
                    menu_item.name, menu_item.description, menu_item.price,
                    menu_item.category, menu_item.image_url, menu_item.is_available,
                    item_id, menu_item.canteen_id
                )
            )
            row = cursor.fetchone()
            if row:
                # Add default values for fields that don't exist in the database
                row['is_vegetarian'] = menu_item.is_vegetarian
                row['is_vegan'] = menu_item.is_vegan
                row['is_gluten_free'] = menu_item.is_gluten_free
                row['preparation_time'] = menu_item.preparation_time
                row['updated_at'] = datetime.now()
                return MenuItem(**row)
            return None

    @staticmethod
    def delete_menu_item(item_id: int, canteen_id: int) -> bool:
        """Delete a menu item"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM menu_items
                WHERE id = %s AND canteen_id = %s
                RETURNING id
                """,
                (item_id, canteen_id)
            )
            return cursor.rowcount > 0

    @staticmethod
    def get_menu_items_by_category(canteen_id: int, category: str) -> List[MenuItem]:
        """Get menu items by category"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT id, name, description, price, category, is_available, 
                       canteen_id, image_url, created_at,
                       CURRENT_TIMESTAMP as updated_at
                FROM menu_items
                WHERE canteen_id = %s AND category = %s
                ORDER BY name
                """,
                (canteen_id, category)
            )
            rows = cursor.fetchall()
            # Add default values for fields that don't exist in the database
            for row in rows:
                row['is_vegetarian'] = False
                row['is_vegan'] = False
                row['is_gluten_free'] = False
                row['preparation_time'] = 15
            return [MenuItem(**row) for row in rows]

    @staticmethod
    def get_categories(canteen_id: int) -> List[str]:
        """Get all categories for a canteen"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """
                SELECT DISTINCT category FROM menu_items
                WHERE canteen_id = %s
                ORDER BY category
                """,
                (canteen_id,)
            )
            rows = cursor.fetchall()
            return [row['category'] for row in rows]
            
    @staticmethod
    def bulk_update_availability(item_ids: List[int], is_available: bool, canteen_id: int) -> int:
        """Update availability for multiple menu items"""
        with get_db_cursor() as cursor:
            # Using ANY with an array in PostgreSQL
            cursor.execute(
                """
                UPDATE menu_items SET
                    is_available = %s
                WHERE id = ANY(%s) AND canteen_id = %s
                """,
                (is_available, item_ids, canteen_id)
            )
            return cursor.rowcount 