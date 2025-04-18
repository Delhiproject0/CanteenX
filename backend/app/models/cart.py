from sqlalchemy import Column, Integer, String,Float, ForeignKey, JSON, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Cart(Base):
    __tablename__ = "carts"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey("users.id"))
    items = Column(JSON)  # Store as JSON array
    totalAmount = Column(Float, default=0)
    canteenId = Column(Integer, ForeignKey("canteens.id"))
    createdAt = Column(String)
    updatedAt = Column(String)
    pickup_date = Column(DateTime, nullable=True)
    pickup_time = Column(String, nullable=True) 
    # Relationships
    user = relationship("User", backref="cart")
    canteen = relationship("Canteen")

class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id"))
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
    quantity = Column(Integer, default=1)
    selected_size = Column(JSON, nullable=True)
    selected_extras = Column(JSON, nullable=True)
    special_instructions = Column(String, nullable=True)
    location = Column(String, nullable=True)  # e.g., "Faculty Lounge", "Main Mess"
