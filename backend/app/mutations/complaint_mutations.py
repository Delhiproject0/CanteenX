import json
import strawberry
from typing import Optional
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.complaints import Complaint, ComplaintType

from datetime import datetime, timezone


@strawberry.type
class ComplaintMutationResponse:
    success: bool
    message: str
    
@strawberry.type
class ComplaintMutation:
    @strawberry.mutation
    def create_complaint(
        self,
        user_id: int,
        order_id: int,
        complaint_text: str,
        heading: str,
        complaint_type: str,
        status: str = "pending",
        is_escalated: bool = False,
        response_text: Optional[str] = None,
    ) -> ComplaintMutationResponse:
        db: Session = next(get_db())
        
        now = datetime.now(timezone.utc)
        
        new_complaint = Complaint(
            user_id=user_id,
            order_id=order_id,
            complaint_text=complaint_text,
            heading=heading,
            complaint_type=complaint_type,
            status=status,
            is_escalated=is_escalated,
            response_text=response_text,
            created_at=now.isoformat(),
            updated_at=now.isoformat()
        )
        
        db.add(new_complaint)
        db.commit()
        db.refresh(new_complaint)
        
        return ComplaintMutationResponse(success=True, message="Complaint created successfully.")
    
    def update_complaint(
        self,
        complaint_id: int,
        complaint_text: Optional[str] = None,
        heading: Optional[str] = None,
        complaint_type: Optional[str] = None,
        status: Optional[str] = None,
        is_escalated: Optional[bool] = None,
        response_text: Optional[str] = None,
    ) -> ComplaintMutationResponse:
        db: Session = next(get_db())
        
        complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
        
        if not complaint:
            return ComplaintMutationResponse(success=False, message="Complaint not found.")
        
        if complaint_text:
            complaint.complaint_text = complaint_text
        if heading:
            complaint.heading = heading
        if complaint_type:
            complaint.complaint_type = complaint_type
        if status:
            complaint.status = status
        if is_escalated is not None:
            complaint.is_escalated = is_escalated
        if response_text:
            complaint.response_text = response_text
        
        now = datetime.now(timezone.utc)
        complaint.updated_at = now.isoformat()
        
        db.commit()
        
        return ComplaintMutationResponse(success=True, message="Complaint updated successfully.")
    
    
    def close_complaint(
        self,
        complaint_id: int,
    ) -> ComplaintMutationResponse:
        db: Session = next(get_db())
        
        complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
        
        if not complaint:
            return ComplaintMutationResponse(success=False, message="Complaint not found.")
        
        complaint.status = "resolved"
        
        now = datetime.now(timezone.utc)
        complaint.updated_at = now.isoformat()
        
        db.commit()
        
        return ComplaintMutationResponse(success=True, message="Complaint closed successfully.")
    
    
    def escalate_complaint(
        self,
        complaint_id: int,
    ) -> ComplaintMutationResponse:
        db: Session = next(get_db())
        
        complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
        
        if not complaint:
            return ComplaintMutationResponse(success=False, message="Complaint not found.")
        
        complaint.is_escalated = True
        
        now = datetime.now(timezone.utc)
        complaint.updated_at = now.isoformat()
        
        db.commit()
        
        return ComplaintMutationResponse(success=True, message="Complaint escalated successfully.")
    
    
mutations = [
    strawberry.mutation(ComplaintMutation.create_complaint, name="createComplaint"),
    strawberry.mutation(ComplaintMutation.update_complaint, name="updateComplaint"),
    strawberry.mutation(ComplaintMutation.close_complaint, name="closeComplaint"),
    strawberry.mutation(ComplaintMutation.escalate_complaint, name="escalateComplaint"),
]