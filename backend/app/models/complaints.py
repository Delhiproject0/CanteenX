from sqlalchemy import Column, Integer, String, Boolean, Enum
from app.core.database import Base
from pydantic import BaseModel
from typing import List, Optional
import strawberry

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)  # Assuming user_id is a foreign key to the users table
    order_id = Column(Integer, nullable=False)  # Assuming order_id is a foreign key to the orders table
    complaint_text = Column(String, nullable=False)
    heading = Column(String, nullable=False)  # Subject or heading of the complaint
    complaint_type = Column(Enum("food_quality", "wrong_order", "billing_issue", "pickup_issue", "poor_service", "other"), nullable=False)
    status = Column(Enum("pending", "resolved", "rejected"), default="pending")
    is_escalated = Column(Boolean, default=False)  # Whether the complaint has been escalated to higher authorities
    response_text = Column(String, nullable=True)  # Response from the canteen or admin
    created_at = Column(String, nullable=False) 
    updated_at = Column(String, nullable=True)  
    
    
@strawberry.type
class ComplaintType:
    id: int
    user_id: int
    order_id: int
    complaint_text: str
    heading: str
    complaint_type: str
    status: str
    is_escalated: bool
    response_text: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None
    
