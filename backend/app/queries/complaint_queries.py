import strawberry
from typing import List, Optional
from app.models.complaints import ComplaintType, Complaint
from app.core.database import get_db

def resolve_get_all_complaints() -> List[ComplaintType]:
    # Get database session
    db = next(get_db())
    
    # Query for the specific user
    complaints = db.query(Complaint).all()
    
    return [ComplaintType(
        id=complaint.id,
        user_id=complaint.user_id,
        order_id=complaint.order_id,
        complaint_text=complaint.complaint_text,
        heading=complaint.heading,
        complaint_type=complaint.complaint_type,
        status=complaint.status,
        is_escalated=complaint.is_escalated,
        response_text=complaint.response_text,
        created_at=complaint.created_at,
        updated_at=complaint.updated_at
    ) for complaint in complaints]


def resolve_get_complaint_by_id(complaint_id: int) -> Optional[ComplaintType]:
    # Get database session
    db = next(get_db())
    
    # Query for the specific complaint
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    
    if not complaint:
        return None

    return ComplaintType(
        id=complaint.id,
        user_id=complaint.user_id,
        order_id=complaint.order_id,
        complaint_text=complaint.complaint_text,
        heading=complaint.heading,
        complaint_type=complaint.complaint_type,
        status=complaint.status,
        is_escalated=complaint.is_escalated,
        response_text=complaint.response_text,
        created_at=complaint.created_at,
        updated_at=complaint.updated_at
    )
def resolve_get_complaints_by_user_id(user_id: int) -> List[ComplaintType]:
    # Get database session
    db = next(get_db())
    
    # Query for the specific user
    complaints = db.query(Complaint).filter(Complaint.user_id == user_id).all()
    
    return [ComplaintType(
        id=complaint.id,
        user_id=complaint.user_id,
        order_id=complaint.order_id,
        complaint_text=complaint.complaint_text,
        heading=complaint.heading,
        complaint_type=complaint.complaint_type,
        status=complaint.status,
        is_escalated=complaint.is_escalated,
        response_text=complaint.response_text,
        created_at=complaint.created_at,
        updated_at=complaint.updated_at
    ) for complaint in complaints]
    
def resolve_get_complaints_by_order_id(order_id: int) -> List[ComplaintType]:
    # Get database session
    db = next(get_db())
    
    # Query for the specific order
    complaints = db.query(Complaint).filter(Complaint.order_id == order_id).all()
    
    return [ComplaintType(
        id=complaint.id,
        user_id=complaint.user_id,
        order_id=complaint.order_id,
        complaint_text=complaint.complaint_text,
        heading=complaint.heading,
        complaint_type=complaint.complaint_type,
        status=complaint.status,
        is_escalated=complaint.is_escalated,
        response_text=complaint.response_text,
        created_at=complaint.created_at,
        updated_at=complaint.updated_at
    ) for complaint in complaints]

# Create properly decorated fields with resolvers and matching frontend field names
getAllComplaints = strawberry.field(name="getAllComplaints", resolver=resolve_get_all_complaints)
getComplaintById = strawberry.field(name="getComplaintById", resolver=resolve_get_complaint_by_id)
getComplaintsByUserId = strawberry.field(name="getComplaintsByUserId", resolver=resolve_get_complaints_by_user_id)
getComplaintsByOrderId = strawberry.field(name="getComplaintsByOrderId", resolver=resolve_get_complaints_by_order_id)

# Add the queries to the list

queries = [
    getAllComplaints,
    getComplaintById,
    getComplaintsByUserId,
    getComplaintsByOrderId,
]