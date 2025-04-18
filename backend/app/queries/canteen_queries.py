import strawberry
from typing import List, Optional
from app.models.canteen import Canteen
from app.core.database import get_db

@strawberry.type
class CanteenType:
    id: int
    name: str
    location: str
    email: Optional[str] = None
    contactNumber: str = strawberry.field(name="contactNumber", default=None)
    breakfastStart: str = strawberry.field(name="breakfastStart", default=None)
    breakfastEnd: str = strawberry.field(name="breakfastEnd", default=None)
    lunchStart: str = strawberry.field(name="lunchStart", default=None)
    lunchEnd: str = strawberry.field(name="lunchEnd", default=None)
    dinnerStart: str = strawberry.field(name="dinnerStart", default=None)
    dinnerEnd: str = strawberry.field(name="dinnerEnd", default=None)
    rating: Optional[float] = None
    ratingCount: int = strawberry.field(name="ratingCount", default=None)
    description: Optional[str] = None
    supportsVegetarian: int = strawberry.field(name="supportsVegetarian", default=1)
    supportsNonVegetarian: int = strawberry.field(name="supportsNonVegetarian", default=1)
    supportsThali: int = strawberry.field(name="supportsThali", default=0)

@strawberry.type
class CanteenQuery:
    @strawberry.field
    def get_canteens(self) -> List[CanteenType]:
        """Get all canteens"""
        db = next(get_db())
        canteens = db.query(Canteen).all()
        return [
            CanteenType(
                id=c.id,
                name=c.name,
                location=c.location,
                email=c.email,
                contactNumber=c.contact_number,
                breakfastStart=c.breakfast_start,
                breakfastEnd=c.breakfast_end,
                lunchStart=c.lunch_start,
                lunchEnd=c.lunch_end,
                dinnerStart=c.dinner_start,
                dinnerEnd=c.dinner_end,
                rating=c.rating,
                ratingCount=c.rating_count,
                description=c.description,
                supportsVegetarian=c.supports_vegetarian,
                supportsNonVegetarian=c.supports_non_vegetarian,
                supportsThali=c.supports_thali
            ) for c in canteens
        ]

    @strawberry.field
    def get_canteen_by_id(self, canteenId: int) -> Optional[CanteenType]:
        """Get a specific canteen by ID"""
        db = next(get_db())
        canteen = db.query(Canteen).filter(Canteen.id == canteenId).first()
        if not canteen:
            return None
        return CanteenType(
            id=canteen.id,
            name=canteen.name,
            location=canteen.location,
            email=canteen.email,
            contactNumber=canteen.contact_number,
            breakfastStart=canteen.breakfast_start,
            breakfastEnd=canteen.breakfast_end,
            lunchStart=canteen.lunch_start,
            lunchEnd=canteen.lunch_end,
            dinnerStart=canteen.dinner_start,
            dinnerEnd=canteen.dinner_end,
            rating=canteen.rating,
            ratingCount=canteen.rating_count,
            description=canteen.description,
            supportsVegetarian=canteen.supports_vegetarian,
            supportsNonVegetarian=canteen.supports_non_vegetarian,
            supportsThali=canteen.supports_thali
        )


# Create a query instance
queries = [
    strawberry.field(name="getCanteens", resolver=CanteenQuery.get_canteens),
    strawberry.field(name="getCanteenById", resolver=CanteenQuery.get_canteen_by_id),
]
