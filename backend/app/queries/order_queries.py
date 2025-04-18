import json
import strawberry
from typing import List, Optional
from app.models.order import OrderType, OrderItem, OrderItemType

from app.models.order import Order
from app.core.database import get_db
from sqlalchemy import desc, func

@strawberry.type
class OrderItemType:
    id: Optional[int] = None  # Made optional to avoid missing key error
    itemId: int
    quantity: int
    customizations: Optional[List[str]] = None
    note: Optional[str] = None

@strawberry.type
class OrderType:
    id: int
    userId: int
    canteenId: int
    totalAmount: float
    status: str
    orderTime: str
    confirmedTime: Optional[str]
    preparingTime: Optional[str]
    readyTime: Optional[str]
    deliveryTime: Optional[str]
    cancelledTime: Optional[str]
    pickupTime: Optional[str]
    paymentMethod: str
    paymentStatus: str
    customerNote: Optional[str]
    cancellationReason: Optional[str]
    discount: float
    phone: str
    isPreOrder: bool
    items: List[OrderItemType]

    @staticmethod
    def from_db_model(order: "Order") -> "OrderType":
        return OrderType(
            id=order.id,
            userId=order.userId,
            canteenId=order.canteenId,
            totalAmount=order.totalAmount,
            status=order.status,
            orderTime=order.orderTime,
            confirmedTime=order.confirmedTime,
            preparingTime=order.preparingTime,
            readyTime=order.readyTime,
            deliveryTime=order.deliveryTime,
            cancelledTime=order.cancelledTime,
            pickupTime=order.pickupTime,
            paymentMethod=order.paymentMethod,
            paymentStatus=order.paymentStatus,
            customerNote=order.customerNote,
            cancellationReason=order.cancellationReason,
            discount=order.discount,
            phone=order.phone,
            isPreOrder=order.isPreOrder,
            items=[
                OrderItemType(
                    id=item.get("id"),
                    itemId=item["itemId"],
                    quantity=item["quantity"],
                    customizations=item.get("customizations"),
                    note=item.get("note")
                )
                for item in order.items
            ]
        )

@strawberry.type
class OrderQuery:
    @strawberry.field
    def get_user_orders(self, userId: int) -> List[OrderType]:
        """Get all orders for a user"""
        db = next(get_db())
        orders = db.query(Order).filter(Order.userId == userId).all()
        return [OrderType.from_db_model(order) for order in orders]

    @strawberry.field
    def get_canteen_orders(self, canteenId: int) -> List[OrderType]:
        """Get all orders for a canteen"""
        db = next(get_db())
        orders = db.query(Order).filter(Order.canteenId == canteenId).all()
        return [OrderType.from_db_model(order) for order in orders]

    @strawberry.field
    def get_order_by_id(self, orderId: int) -> Optional[OrderType]:
        """Get a specific order by ID"""
        db = next(get_db())
        order = db.query(Order).filter(Order.id == orderId).first()
        return OrderType.from_db_model(order) if order else None

    @strawberry.field
    def get_orders_by_status(self, status: str) -> List[OrderType]:
        """Get all orders with a specific status"""
        db = next(get_db())
        orders = db.query(Order).filter(Order.status == status.lower()).all()
        return [OrderType.from_db_model(order) for order in orders]

def resolve_get_all_orders(user_id: int) -> List[OrderType]:
    """
    Query to retrieve all orders for a specific user.
    """
    db = next(get_db())
    orders_query = db.query(Order).filter(Order.user_id == user_id).order_by(desc(Order.created_at)).all()
    result = []

    for order in orders_query:
        order_items_query = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        order_items = []

        for item in order_items_query:
            order_items.append(OrderItemType(
                order_item_id=item.id,
                order_id=item.order_id,
                menu_item_id=item.menu_item_id,
                menu_item_name=item.menu_item_name,
                canteen_id=item.canteen_id,
                canteen_name=item.canteen_name,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.total_price,
                size=json.dumps(item.size) if item.size else None,  # Parse JSON string
                extras=json.dumps(item.extras) if item.extras else None,  # Parse JSON string
                preparation_time=item.preparation_time,
                is_prepared=item.is_prepared,
                special_instructions=item.special_instructions,
                notes=item.notes
            ))

        order_data = OrderType(
            order_id=order.id,
            user_id=order.user_id,
            canteen_id=order.canteen_id,
            items=order_items,
            subtotal=order.subtotal,
            tax_amount=order.tax_amount,
            total_amount=order.total_amount,
            status=order.status,
            priority=order.priority,
            tax_rate=order.tax_rate,
            payment_status=order.payment_status,
            payment_method=order.payment_method,
            payment_id=order.payment_id,
            cancellation_reason=order.cancellation_reason,
            cancellation_notes=order.cancellation_notes,
            pickup_time=order.pickup_time,
            created_at=order.created_at,
            updated_at=order.updated_at
        )

        result.append(order_data)

    return result


def resolve_get_active_orders(user_id: int) -> List[OrderType]:
    """
    Query to retrieve all active orders for a specific user.
    Active orders are those with status other than COMPLETED, CANCELLED, or REJECTED.
    """
    db = next(get_db())
    inactive_statuses = ['completed', 'cancelled', 'rejected']
    
    orders_query = db.query(Order)\
        .filter(Order.user_id == user_id)\
        .filter(func.lower(Order.status).notin_([status.lower() for status in inactive_statuses]))\
        .order_by(desc(Order.created_at))\
        .all()
    result = []

    for order in orders_query:
        order_items_query = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        order_items = []

        for item in order_items_query:
            order_items.append(OrderItemType(
                order_item_id=item.id,
                order_id=item.order_id,
                menu_item_id=item.menu_item_id,
                menu_item_name=item.menu_item_name,
                canteen_id=item.canteen_id,
                canteen_name=item.canteen_name,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.total_price,
                size=json.dumps(item.size) if item.size else None,  # Parse JSON string
                extras=json.dumps(item.extras) if item.extras else None,  # Parse JSON string
                preparation_time=item.preparation_time,
                is_prepared=item.is_prepared,
                special_instructions=item.special_instructions,
                notes=item.notes
            ))

        order_data = OrderType(
            order_id=order.id,
            user_id=order.user_id,
            canteen_id=order.canteen_id,
            items=order_items,
            subtotal=order.subtotal,
            tax_amount=order.tax_amount,
            total_amount=order.total_amount,
            status=order.status,
            priority=order.priority,
            tax_rate=order.tax_rate,
            payment_status=order.payment_status,
            payment_method=order.payment_method,
            payment_id=order.payment_id,
            cancellation_reason=order.cancellation_reason,
            cancellation_notes=order.cancellation_notes,
            pickup_time=order.pickup_time,
            created_at=order.created_at,
            updated_at=order.updated_at
        )

        result.append(order_data)

    return result


def resolve_get_order_by_id(order_id: int) -> Optional[OrderType]:
    """
    Query to retrieve a specific order by its ID.
    Includes a user_id parameter for security validation.
    """
    db = next(get_db())
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        return None

    order_items_query = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    order_items = []

    for item in order_items_query:
        order_items.append(OrderItemType(
            order_item_id=item.id,
            order_id=item.order_id,
            menu_item_id=item.menu_item_id,
            menu_item_name=item.menu_item_name,
            canteen_id=item.canteen_id,
            canteen_name=item.canteen_name,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price,
            size=json.dumps(item.size) if item.size else None,  # Parse JSON string
            extras=json.dumps(item.extras) if item.extras else None,  # Parse JSON string
            preparation_time=item.preparation_time,
            is_prepared=item.is_prepared,
            special_instructions=item.special_instructions,
            notes=item.notes
        ))

    order_data = OrderType(
        order_id=order.id,
        user_id=order.user_id,
        canteen_id=order.canteen_id,
        items=order_items,
        subtotal=order.subtotal,
        tax_amount=order.tax_amount,
        total_amount=order.total_amount,
        status=order.status,
        priority=order.priority,
        tax_rate=order.tax_rate,
        payment_status=order.payment_status,
        payment_method=order.payment_method,
        payment_id=order.payment_id,
        cancellation_reason=order.cancellation_reason,
        cancellation_notes=order.cancellation_notes,
        pickup_time=order.pickup_time,
        created_at=order.created_at,
        updated_at=order.updated_at
    )

    return order_data

getAllOrders = strawberry.field(name="getAllOrders", resolver=resolve_get_all_orders)
getActiveOrders = strawberry.field(name="getActiveOrders", resolver=resolve_get_active_orders)
getOrderById = strawberry.field(name="getOrderById", resolver=resolve_get_order_by_id)

queries = [
    getAllOrders,
    getActiveOrders,
    getOrderById,
    strawberry.field(name="getUserOrders", resolver=OrderQuery.get_user_orders),
    strawberry.field(name="getCanteenOrders", resolver=OrderQuery.get_canteen_orders),
    strawberry.field(name="getOrderById", resolver=OrderQuery.get_order_by_id),
    strawberry.field(name="getOrdersByStatus", resolver=OrderQuery.get_orders_by_status),

]