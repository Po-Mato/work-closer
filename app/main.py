from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import os
from shapely.geometry import Point
from .isochrone_service import generate_isochrone_polygon

load_dotenv()

app = FastAPI()


@app.get("/")
async def read_root():
    return {"message": "Welcome to Work Closer Isochrone API!"}


@app.post("/isochrone")
async def get_isochrone(
    start_longitude: float,
    start_latitude: float,
    travel_time_minutes: int,
    travel_mode: str = "car",
):
    if not (-180 <= start_longitude <= 180 and -90 <= start_latitude <= 90):
        raise HTTPException(status_code=400, detail="Invalid coordinates.")
    if travel_time_minutes <= 0:
        raise HTTPException(status_code=400, detail="Travel time must be positive.")
    if travel_mode not in ["car"]:
        raise HTTPException(
            status_code=400,
            detail="Unsupported travel mode. Currently only 'car' is supported.",
        )

    start_point = Point(start_longitude, start_latitude)
    isochrone_geojson = await generate_isochrone_polygon(
        start_point, travel_time_minutes, travel_mode
    )

    if isochrone_geojson is None:
        raise HTTPException(
            status_code=500, detail="Failed to generate isochrone polygon."
        )

    return isochrone_geojson
