from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import Request

app = FastAPI(lifespan=lambda app: app)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    return JSONResponse(content={"message": "Welcome to FastAPI!"})

@app.get("/health")
async def health():
    return JSONResponse(content={"status": "healthy"})