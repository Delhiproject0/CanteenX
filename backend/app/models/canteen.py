from sqlalchemy import Column, Integer, String, Float, Text
from app.core.database import Base

class Canteen(Base):
    __tablename__ = "canteens"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    
    # Contact information
    email = Column(String, nullable=True)
    contact_number = Column(String, nullable=True)
    
    # Operating hours
    breakfast_start = Column(String, nullable=True)
    breakfast_end = Column(String, nullable=True)
    lunch_start = Column(String, nullable=True)
    lunch_end = Column(String, nullable=True)
    dinner_start = Column(String, nullable=True)
    dinner_end = Column(String, nullable=True)
    
    # Rating system
    rating = Column(Float, nullable=True, default=0.0)
    rating_count = Column(Integer, nullable=True, default=0)
    
    # Additional details
    description = Column(Text, nullable=True)
    supports_vegetarian = Column(Integer, nullable=True, default=1)
    supports_non_vegetarian = Column(Integer, nullable=True, default=1)
    supports_thali = Column(Integer, nullable=True, default=1)