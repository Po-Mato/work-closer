from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
import os

load_dotenv()

app = FastAPI()

from app.ab_service import (
    create_experiment,
    get_experiment,
    get_all_experiments,
    assign_variant,
    track_event,
    get_results,
    experiments as ab_experiments,
)


class ExperimentCreate(BaseModel):
    key: str
    variants: dict
    active: bool = True


class EventCreate(BaseModel):
    experiment_key: str
    variant: str
    event_type: str
    user_id: Optional[str] = None


@app.get("/")
async def read_root():
    return {"message": "Welcome to Work Closer Isochrone API!"}


@app.post("/ab/experiments")
async def post_experiment(body: ExperimentCreate):
    try:
        exp = create_experiment(body.key, body.variants, body.active)
        return {
            "key": exp.key,
            "variants": exp.variants,
            "active": exp.active,
            "created_at": exp.created_at.isoformat(),
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/ab/experiments")
async def list_experiments():
    return get_all_experiments()


@app.get("/ab/experiments/{key}")
async def get_exp(key: str):
    exp = get_experiment(key)
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found")
    variant = assign_variant(key)
    return {
        "key": exp.key,
        "variants": exp.variants,
        "active": exp.active,
        "assigned_variant": variant,
    }


@app.post("/ab/events", status_code=201)
async def post_event(body: EventCreate):
    if body.experiment_key not in ab_experiments:
        raise HTTPException(status_code=404, detail="Experiment not found")
    evt = track_event(body.experiment_key, body.variant, body.event_type, body.user_id)
    return {"status": "ok", "timestamp": evt.timestamp.isoformat()}


@app.get("/ab/experiments/{key}/results")
async def get_exp_results(key: str):
    results = get_results(key)
    if not results:
        raise HTTPException(status_code=404, detail="Experiment not found or no events")
    return results


@app.post("/isochrone")
async def get_isochrone():
    raise HTTPException(
        status_code=501, detail="Isochrone endpoint not yet re-implemented"
    )
