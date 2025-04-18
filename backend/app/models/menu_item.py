from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    category = Column(String, nullable=True)
    canteen_id = Column(Integer, ForeignKey("canteens.id"))

    # Availability flags
    is_available = Column(Integer, default=1)  # 1 for available, 0 for unavailable
    is_vegetarian = Column(Integer, default=0)  # 1 for vegetarian, 0 for non-vegetarian
    is_featured = Column(Integer, default=0)  # 1 for featured, 0 for non-featured
    
    # Size and pricing options
    has_size_variations = Column(Boolean, default=False)
    size_options = Column(JSON, nullable=True)  # Store as {"regular": 0, "large": 40} format
    
    # Quantity controls
    min_quantity = Column(Integer, default=1)
    max_quantity = Column(Integer, default=10)
    
    # Preparation details
    preparation_time = Column(Integer, nullable=True)  # in minutes
    
    # Dietary preferences
    is_vegan = Column(Boolean, default=False)
    is_gluten_free = Column(Boolean, default=False)
    
    # Special instructions
    allows_special_instructions = Column(Boolean, default=True)
    special_instructions_prompt = Column(String, nullable=True)  # Custom prompt for special instructions
    
    # Additional attributes for better UX
    calories = Column(Integer, nullable=True)  # Calories per serving
    spice_level = Column(Integer, default=1)  # 1-5 scale
    popularity_score = Column(Float, default=0.0)  # Based on orders
    average_rating = Column(Float, default=0.0)  # Average customer rating
    total_ratings = Column(Integer, default=0)  # Number of ratings

    # Customization options
    customization_options = Column(JSON, nullable=True)  # Store as JSON

