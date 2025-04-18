from fastapi import FastAPI
from fastapi.routing import APIRouter
from strawberry.fastapi import GraphQLRouter
import strawberry
from strawberry.tools import create_type

from app.queries import queries
from app.api import payment  # Import payment API router

Query = create_type("Query", queries)
graphql_schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema=graphql_schema)

app = FastAPI()

# GraphQL endpoint
api_router = APIRouter()
api_router.include_router(graphql_app, prefix="/graphql")
app.include_router(api_router, prefix="/api")

# Include payment API routes
app.include_router(payment.router)

# REST endpoint
@app.get("/api/hello")
async def read_root():
    return {"message": "Hello from REST!"}
