"""
Mock data script to populate the database with initial data for development
"""
import datetime
import json
from sqlalchemy.orm import Session

from app.core.database import engine, Base, get_db
from app.models.canteen import Canteen
from app.models.menu_item import MenuItem
from app.models.user import User
from app.models.cart import Cart, CartItem
from app.models.order import Order, OrderItem, OrderStep

def add_mock_users(db: Session):
    """Add mock users to the database"""
    users = [
        User(id=1, name="John Doe", email="john@example.com"),
        User(id=2, name="Jane Smith", email="jane@example.com"),
        User(id=3,name="Canteen Admin_1",email = "central.canteen@university.edu")
    ]
    
    for user in users:
        db_user = db.query(User).filter(User.id == user.id).first()
        if not db_user:
            db.add(user)
    
    db.commit()
    print("✅ Mock users added to database")

def add_mock_canteens(db: Session):
    """Add mock canteens to the database"""
    canteens = [
        Canteen(
            id=1, 
            name="Central Canteen", 
            location="Main Building",
            email="central.canteen@university.edu",
            contact_number="+91-9876543210",
            breakfast_start="07:30",
            breakfast_end="10:30",
            lunch_start="12:00",
            lunch_end="15:00",
            dinner_start="18:00",
            dinner_end="22:00",
            rating=4.2,
            rating_count=320,
            description="The main campus canteen serving a variety of cuisines including North Indian, South Indian, and Chinese.",
            supports_vegetarian=1,
            supports_non_vegetarian=1,
            supports_thali=1
        ),
        Canteen(
            id=2, 
            name="Library Cafe", 
            location="Library Building",
            email="library.cafe@university.edu",
            contact_number="+91-9876543211",
            breakfast_start="08:00",
            breakfast_end="11:00",
            lunch_start="12:00",
            lunch_end="16:00",
            dinner_start="17:00",
            dinner_end="20:00",
            rating=4.5,
            rating_count=180,
            description="A cozy cafe perfect for quick bites and refreshments while studying.",
            supports_vegetarian=1,
            supports_non_vegetarian=0,
            supports_thali=0
        ),
        Canteen(
            id=3, 
            name="Tech Hub Canteen", 
            location="Technology Block",
            email="techhub.canteen@university.edu",
            contact_number="+91-9876543212",
            breakfast_start="07:00",
            breakfast_end="10:00",
            lunch_start="11:30",
            lunch_end="15:30",
            dinner_start="18:30",
            dinner_end="23:00",
            rating=4.0,
            rating_count=250,
            description="Modern canteen serving quick meals and snacks, popular among engineering students.",
            supports_vegetarian=1,
            supports_non_vegetarian=1,
            supports_thali=1
        )
    ]
    
    for canteen in canteens:
        db_canteen = db.query(Canteen).filter(Canteen.id == canteen.id).first()
        if not db_canteen:
            db.add(canteen)
    
    db.commit()
    print("✅ Mock canteens added to database")

def add_mock_menu_items(db: Session):
    """Add mock menu items to the database"""
    menu_items = [
        MenuItem(
            id=1, 
            name="Paneer Butter Masala", 
            description="Rich and creamy paneer curry made with fresh paneer cubes in a tomato-based gravy",
            price=180.0, 
            image_url="https://images.unsplash.com/photo-1567188040759-fb8a254b3bd2?q=80&w=300&auto=format&fit=crop",
            category="Indian Delights", 
            canteen_id=1, 
            is_available=1, 
            is_vegetarian=1, 
            is_featured=1,
            has_size_variations=True,
            size_options="{\"regular\": 0, \"large\": 40}",  # JSON string format
            min_quantity=1,
            max_quantity=5,
            preparation_time=20,
            is_vegan=False,
            is_gluten_free=True,
            allows_special_instructions=True,
            special_instructions_prompt="Any specific spice level or preparation instructions?",
            calories=450,
            spice_level=3,
            popularity_score=4.8,
            average_rating=4.5,
            total_ratings=120
        ),
        MenuItem(
            id=2, 
            name="Masala Dosa", 
            description="Crispy crepe filled with spicy potato filling, served with sambar and chutneys",
            price=80.0, 
            image_url="https://images.unsplash.com/photo-1589301760014-d929f86731c7?q=80&w=300&auto=format&fit=crop",
            category="South Indian", 
            canteen_id=1, 
            is_available=1, 
            is_vegetarian=1, 
            is_featured=0,
            has_size_variations=False,
            size_options=None,
            min_quantity=1,
            max_quantity=3,
            preparation_time=15,
            is_vegan=True,
            is_gluten_free=False,
            allows_special_instructions=True,
            special_instructions_prompt="Any specific instructions for chutney or sambar?",
            calories=300,
            spice_level=2,
            popularity_score=4.6,
            average_rating=4.7,
            total_ratings=200
        ),
        MenuItem(
            id=3, 
            name="Cold Coffee", 
            description="Refreshing cold coffee with vanilla ice cream and chocolate sauce",
            price=70.0, 
            image_url="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=300&auto=format&fit=crop",
            category="Beverages", 
            canteen_id=2, 
            is_available=1, 
            is_vegetarian=1, 
            is_featured=1,
            has_size_variations=True,
            size_options="{\"regular\": 0, \"large\": 30}",  # JSON string format
            min_quantity=1,
            max_quantity=4,
            preparation_time=5,
            is_vegan=False,
            is_gluten_free=True,
            allows_special_instructions=True,
            special_instructions_prompt="Customize sugar level or extra toppings?",
            calories=180,
            spice_level=0,
            popularity_score=4.9,
            average_rating=4.8,
            total_ratings=150
        ),
        MenuItem(
            id=4, 
            name="Veg Burger", 
            description="Delicious vegetable patty with fresh veggies, cheese, and special sauce",
            price=90.0, 
            image_url="https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=300&auto=format&fit=crop",
            category="Fast Food", 
            canteen_id=3, 
            is_available=1, 
            is_vegetarian=1, 
            is_featured=1,
            has_size_variations=False,
            size_options=None,
            min_quantity=1,
            max_quantity=5,
            preparation_time=12,
            is_vegan=False,
            is_gluten_free=False,
            allows_special_instructions=True,
            special_instructions_prompt="Any toppings to remove or special sauce instructions?",
            calories=380,
            spice_level=1,
            popularity_score=4.5,
            average_rating=4.3,
            total_ratings=180
        ),
        MenuItem(
            id=5, 
            name="French Fries", 
            description="Crispy potato fries with special seasoning and dipping sauce",
            price=60.0, 
            image_url="https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=300&auto=format&fit=crop",
            category="Fast Food", 
            canteen_id=3, 
            is_available=1, 
            is_vegetarian=1, 
            is_featured=0,
            has_size_variations=True,
            size_options="{\"small\": -20, \"regular\": 0, \"large\": 30}",  # JSON string format
            min_quantity=1,
            max_quantity=3,
            preparation_time=10,
            is_vegan=True,
            is_gluten_free=True,
            allows_special_instructions=True,
            special_instructions_prompt="Any specific seasoning preference?",
            calories=250,
            spice_level=1,
            popularity_score=4.7,
            average_rating=4.6,
            total_ratings=220
        )
    ]
    
    for item in menu_items:
        db_item = db.query(MenuItem).filter(MenuItem.id == item.id).first()
        if not db_item:
            db.add(item)
    
    db.commit()
    print("✅ Mock menu items added to database")

def add_mock_cart_data(db: Session):
    """Add mock cart data to the database"""
    # Create cart for user 1
    cart1 = db.query(Cart).filter(Cart.user_id == 1).first()
    if not cart1:
        cart1 = Cart(
            user_id=1,
            created_at=datetime.datetime.utcnow().isoformat(),
            updated_at=datetime.datetime.utcnow().isoformat()
        )
        db.add(cart1)
        db.flush()  # Get the ID without committing
    
    # Clear any existing cart items for this cart
    db.query(CartItem).filter(CartItem.cart_id == cart1.id).delete()
    
    # Add items to cart 1
    cart_items = [
        CartItem(
            cart_id=cart1.id,
            menu_item_id=1,
            name="Paneer Butter Masala",
            price=180.0,
            quantity=1,
            customizations=json.dumps({
                "Spice Level": "Medium",
                "Extra Paneer": True
            }),
            image="https://images.unsplash.com/photo-1567188040759-fb8a254b3bd2?q=80&w=300&auto=format&fit=crop",
            description="Rich and creamy paneer curry",
            vendor_name="Indian Delights"
        ),
        CartItem(
            cart_id=cart1.id,
            menu_item_id=3,
            name="Cold Coffee",
            price=70.0,
            quantity=2,
            customizations=json.dumps({
                "Sugar": "Less",
                "Ice": "Regular"
            }),
            image="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=300&auto=format&fit=crop",
            description="Refreshing cold coffee with ice cream",
            vendor_name="Beverages"
        ),
        CartItem(
            cart_id=cart1.id,
            menu_item_id=4,
            name="Veg Burger",
            price=90.0,
            quantity=1,
            customizations=json.dumps({
                "Extra Cheese": True,
                "No Onion": True
            }),
            image="https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=300&auto=format&fit=crop",
            description="Delicious vegetable patty with fresh veggies",
            vendor_name="Fast Food"
        )
    ]
    
    for item in cart_items:
        db.add(item)
    
    # Create cart for user 2
    cart2 = db.query(Cart).filter(Cart.user_id == 2).first()
    if not cart2:
        cart2 = Cart(
            user_id=2,
            created_at=datetime.datetime.utcnow().isoformat(),
            updated_at=datetime.datetime.utcnow().isoformat()
        )
        db.add(cart2)
        db.flush()  # Get the ID without committing
    
    # Clear any existing cart items for this cart
    db.query(CartItem).filter(CartItem.cart_id == cart2.id).delete()
    
    # Add items to cart 2
    cart_items = [
        CartItem(
            cart_id=cart2.id,
            menu_item_id=2,
            name="Masala Dosa",
            price=80.0,
            quantity=2,
            customizations=json.dumps({
                "Extra Chutney": True
            }),
            image="https://images.unsplash.com/photo-1589301760014-d929f86731c7?q=80&w=300&auto=format&fit=crop",
            description="Crispy crepe filled with spicy potato filling",
            vendor_name="South Indian"
        ),
        CartItem(
            cart_id=cart2.id,
            menu_item_id=5,
            name="French Fries",
            price=60.0,
            quantity=1,
            customizations=json.dumps({
                "Extra Salt": True,
                "Sauce": "Ketchup"
            }),
            image="https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=300&auto=format&fit=crop",
            description="Crispy potato fries with seasoning",
            vendor_name="Fast Food"
        )
    ]
    
    for item in cart_items:
        db.add(item)
    
    db.commit()
    print("✅ Mock cart data added to database")

def add_mock_orders(db: Session):
    """Add mock orders to the database"""
    # Clear existing order data
    db.query(OrderStep).delete()
    db.query(OrderItem).delete()
    db.query(Order).delete()
    
    # Active order for current date (April 17, 2025)
    active_order = Order(
        id="ORD12345",
        user_id=1,
        date=datetime.datetime.strptime("2025-04-16T12:15:00.000Z", "%Y-%m-%dT%H:%M:%S.%fZ"),
        total=450.00,
        status="Processing",
        canteen_name="Central Canteen",
        vendor_name="Indian Delights",
        estimated_delivery_time="12:45 PM",
        current_status="Preparing"
    )
    db.add(active_order)
    db.flush()
    
    # Order steps for active order
    order_steps = [
        OrderStep(
            order_id=active_order.id,
            status="Order Placed",
            description="Your order has been received by the vendor.",
            time="12:15 PM",
            completed=1,
            current=0
        ),
        OrderStep(
            order_id=active_order.id,
            status="Preparing",
            description="The kitchen is preparing your food.",
            time="12:20 PM",
            completed=0,
            current=1
        ),
        OrderStep(
            order_id=active_order.id,
            status="Ready for Pickup",
            description="Your order is ready for pickup.",
            time="",
            completed=0,
            current=0
        ),
        OrderStep(
            order_id=active_order.id,
            status="Completed",
            description="Your order has been picked up.",
            time="",
            completed=0,
            current=0
        )
    ]
    for step in order_steps:
        db.add(step)
        
    # Order items for active order
    order_items = [
        OrderItem(
            order_id=active_order.id,
            menu_item_id=1,
            name="Butter Chicken",
            price=220.00,
            quantity=1,
            customizations=json.dumps(["Extra Butter", "Medium Spicy"]),
            vendor_name="Indian Delights"
        ),
        OrderItem(
            order_id=active_order.id,
            menu_item_id=2,
            name="Garlic Naan",
            price=40.00,
            quantity=2,
            customizations=json.dumps([]),
            vendor_name="Indian Delights"
        ),
        OrderItem(
            order_id=active_order.id,
            menu_item_id=3,
            name="Jeera Rice",
            price=150.00,
            quantity=1,
            customizations=json.dumps(["Large Portion"]),
            vendor_name="Indian Delights"
        )
    ]
    for item in order_items:
        db.add(item)
    
    # Order history
    order_history = [
        Order(
            id="ORD12344",
            user_id=1,
            date=datetime.datetime.strptime("2025-04-12T15:30:00.000Z", "%Y-%m-%dT%H:%M:%S.%fZ"),
            total=320.00,
            status="Completed",
            canteen_name="Central Canteen",
            vendor_name="Indian Delights"
        ),
        Order(
            id="ORD12343",
            user_id=1,
            date=datetime.datetime.strptime("2025-04-10T13:15:00.000Z", "%Y-%m-%dT%H:%M:%S.%fZ"),
            total=280.00,
            status="Completed",
            canteen_name="South Campus Cafeteria",
            vendor_name="Sandwich King"
        ),
        Order(
            id="ORD12340",
            user_id=1,
            date=datetime.datetime.strptime("2025-04-05T19:30:00.000Z", "%Y-%m-%dT%H:%M:%S.%fZ"),
            total=520.00,
            status="Cancelled",
            canteen_name="North Block Canteen",
            vendor_name="Chinese Corner"
        )
    ]
    
    # Add order history
    for order in order_history:
        db.add(order)
    
    # Add items for first history order
    history_items1 = [
        OrderItem(
            order_id="ORD12344",
            menu_item_id=1,
            name="Paneer Butter Masala",
            price=180.00,
            quantity=1,
            customizations=json.dumps(["Extra Spicy", "Regular Portion"]),
            vendor_name="Indian Delights"
        ),
        OrderItem(
            order_id="ORD12344",
            menu_item_id=2,
            name="Garlic Naan",
            price=40.00,
            quantity=2,
            customizations=json.dumps([]),
            vendor_name="Indian Delights"
        ),
        OrderItem(
            order_id="ORD12344",
            menu_item_id=3,
            name="Sweet Lassi",
            price=60.00,
            quantity=1,
            customizations=json.dumps([]),
            vendor_name="Indian Delights"
        )
    ]
    
    # Add items for second history order
    history_items2 = [
        OrderItem(
            order_id="ORD12343",
            menu_item_id=4,
            name="Grilled Chicken Club Sandwich",
            price=150.00,
            quantity=1,
            customizations=json.dumps(["No Onions", "Extra Cheese"]),
            vendor_name="Sandwich King"
        ),
        OrderItem(
            order_id="ORD12343",
            menu_item_id=5,
            name="French Fries",
            price=80.00,
            quantity=1,
            customizations=json.dumps(["Extra Salt"]),
            vendor_name="Sandwich King"
        ),
        OrderItem(
            order_id="ORD12343",
            menu_item_id=3,
            name="Chocolate Shake",
            price=50.00,
            quantity=1,
            customizations=json.dumps([]),
            vendor_name="Sandwich King"
        )
    ]
    
    # Add items for third history order
    history_items3 = [
        OrderItem(
            order_id="ORD12340",
            menu_item_id=1,
            name="Hakka Noodles",
            price=160.00,
            quantity=1,
            customizations=json.dumps(["Extra Veggies"]),
            vendor_name="Chinese Corner"
        ),
        OrderItem(
            order_id="ORD12340",
            menu_item_id=2,
            name="Chilli Paneer",
            price=180.00,
            quantity=1,
            customizations=json.dumps(["Dry", "Extra Spicy"]),
            vendor_name="Chinese Corner"
        ),
        OrderItem(
            order_id="ORD12340",
            menu_item_id=3,
            name="Veg Spring Rolls",
            price=120.00,
            quantity=1,
            customizations=json.dumps([]),
            vendor_name="Chinese Corner"
        ),
        OrderItem(
            order_id="ORD12340",
            menu_item_id=4,
            name="Fried Rice",
            price=60.00,
            quantity=1,
            customizations=json.dumps(["No Eggs"]),
            vendor_name="Chinese Corner"
        )
    ]
    
    # Add all history order items
    for item in history_items1 + history_items2 + history_items3:
        db.add(item)
    
    db.commit()
    print("✅ Mock orders added to database")

def initialize_mock_data():
    """Initialize database with mock data"""
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created")
        
        # Add mock data
        db = next(get_db())
        add_mock_users(db)
        add_mock_canteens(db)
        add_mock_menu_items(db)
        add_mock_cart_data(db)
        add_mock_orders(db)
        
        print("✅ All mock data added successfully")
    except Exception as e:
        print(f"❌ Error initializing mock data: {e}")

if __name__ == "__main__":
    initialize_mock_data()