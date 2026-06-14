from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from contextlib import asynccontextmanager

from agents.validation_agent import run as validation_run
from agents.valuation_agent import run as valuation_run
from agents.explanation_agent import run as explanation_run
import config

from auth.database import init_db
from auth.routes import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)



class PropertyInput(BaseModel):
    locality: str
    property_type: str
    area_sqft: float = Field(..., gt=0)
    bhk: int = Field(..., ge=0)
    age_category: str
    facing: str
    road_connectivity: str
    crime_rate: str
    nearby_schools: str
    nearby_hospitals: str
    nearby_markets: str
    future_projects: str
    owner_type: str
    listing_price: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


@app.post("/api/predict")
async def predict(prop: PropertyInput):
    data = prop.dict()
    # step 1: validation
    validation = validation_run(data)

    # step 2: valuation
    valuation = valuation_run(data)

    # step 3: explanation (may call LLM)
    explanation_text = explanation_run(data, valuation)

    response = {
        "predicted_value": valuation.get("predicted_value"),
        "predicted_per_sqft": valuation.get("predicted_per_sqft"),
        "confidence_band": valuation.get("confidence_band"),
        "locality_avg": valuation.get("locality_avg"),
        "valuation_verdict": valuation.get("valuation_verdict"),
        "explanation_text": explanation_text,
        "validation": validation,
        "agent_trace": ["validation_agent", "valuation_agent", "explanation_agent"]
    }
    return response


@app.get("/api/localities")
async def localities():
    return {"localities": config.KNOWN_LOCALITIES, "circle_rates": config.CIRCLE_RATES, "market_rates": config.MARKET_RATES}


@app.get("/api/health")
async def health():
    return {"status": "ok", "model": "XGBoost + Groq LLaMA3", "version": "2.0"}


@app.get("/")
async def root():
    return {
        "message": "IntelliValue API",
        "health": "/api/health",
        "localities": "/api/localities",
        "predict": "POST /api/predict (JSON body)",
        "docs": "/docs"
    }


@app.get('/favicon.ico')
async def favicon():
    return ""

