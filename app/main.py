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
from app.bmc_service import (
    create_bmc,
    get_bmc,
    get_all_bmcs,
    update_bmc,
    delete_bmc,
)


class ExperimentCreate(BaseModel):
    key: str
    variants: dict
    active: bool = True


class BMCUpdate(BaseModel):
    keyPartners: Optional[str] = None
    keyActivities: Optional[str] = None
    keyResources: Optional[str] = None
    valuePropositions: Optional[str] = None
    customerRelationships: Optional[str] = None
    channels: Optional[str] = None
    customerSegments: Optional[str] = None
    costStructure: Optional[str] = None
    revenueStreams: Optional[str] = None


from app.isochrone_service import generate_isochrone_polygon, Point


class IsochroneRequest(BaseModel):
    startLongitude: float
    startLatitude: float
    travelTimeMinutes: int
    travelMode: str = "car"
    considerTraffic: bool = True


class EventCreate(BaseModel):
    experiment_key: str
    variant: str
    event_type: str
    user_id: Optional[str] = None


@app.post("/isochrone")
async def post_isochrone(body: IsochroneRequest):
    if body.travelMode not in ("car", "transit"):
        raise HTTPException(
            status_code=400,
            detail="Only 'car' and 'transit' travel modes are supported",
        )
    start = Point(body.startLongitude, body.startLatitude)
    result = await generate_isochrone_polygon(
        body.travelTimeMinutes,
        body.travelMode,
        start,
        consider_traffic=body.considerTraffic,
    )
    if result is None:
        raise HTTPException(
            status_code=422,
            detail="Could not generate isochrone for the given parameters",
        )
    return result


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


@app.post("/bmc")
async def list_bmcs():
    return [
        {
            "id": bmc.id,
            "keyPartners": bmc.key_partners,
            "keyActivities": bmc.key_activities,
            "keyResources": bmc.key_resources,
            "valuePropositions": bmc.value_propositions,
            "customerRelationships": bmc.customer_relationships,
            "channels": bmc.channels,
            "customerSegments": bmc.customer_segments,
            "costStructure": bmc.cost_structure,
            "revenueStreams": bmc.revenue_streams,
            "createdAt": bmc.created_at.isoformat(),
            "updatedAt": bmc.updated_at.isoformat(),
        }
        for bmc in get_all_bmcs()
    ]


@app.get("/bmc/{bmc_id}")
async def get_bmc_by_id(bmc_id: str):
    bmc = get_bmc(bmc_id)
    if not bmc:
        raise HTTPException(status_code=404, detail="BMC not found")
    return {
        "id": bmc.id,
        "keyPartners": bmc.key_partners,
        "keyActivities": bmc.key_activities,
        "keyResources": bmc.key_resources,
        "valuePropositions": bmc.value_propositions,
        "customerRelationships": bmc.customer_relationships,
        "channels": bmc.channels,
        "customerSegments": bmc.customer_segments,
        "costStructure": bmc.cost_structure,
        "revenueStreams": bmc.revenue_streams,
        "createdAt": bmc.created_at.isoformat(),
        "updatedAt": bmc.updated_at.isoformat(),
    }


@app.patch("/bmc/{bmc_id}")
async def patch_bmc(bmc_id: str, body: BMCUpdate):
    bmc = update_bmc(
        bmc_id,
        key_partners=body.keyPartners,
        key_activities=body.keyActivities,
        key_resources=body.keyResources,
        value_propositions=body.valuePropositions,
        customer_relationships=body.customerRelationships,
        channels=body.channels,
        customer_segments=body.customerSegments,
        cost_structure=body.costStructure,
        revenue_streams=body.revenueStreams,
    )
    if not bmc:
        raise HTTPException(status_code=404, detail="BMC not found")
    return {
        "id": bmc.id,
        "keyPartners": bmc.key_partners,
        "keyActivities": bmc.key_activities,
        "keyResources": bmc.key_resources,
        "valuePropositions": bmc.value_propositions,
        "customerRelationships": bmc.customer_relationships,
        "channels": bmc.channels,
        "customerSegments": bmc.customer_segments,
        "costStructure": bmc.cost_structure,
        "revenueStreams": bmc.revenue_streams,
        "createdAt": bmc.created_at.isoformat(),
        "updatedAt": bmc.updated_at.isoformat(),
    }


@app.delete("/bmc/{bmc_id}")
async def delete_bmc_by_id(bmc_id: str):
    deleted = delete_bmc(bmc_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="BMC not found")
    return {"status": "ok"}
