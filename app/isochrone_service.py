import os
import math
import time
import asyncio
import httpx
import structlog
from functools import lru_cache
from typing import Optional

from dotenv import load_dotenv

load_dotenv()

NAVER_CLIENT_ID = os.getenv("NAVER_CLIENT_ID") or ""
NAVER_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET") or ""

logger = structlog.get_logger()


class Point:
    __slots__ = ("x", "y")

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x:.6f}, {self.y:.6f})"


class CacheEntry:
    __slots__ = ("value", "expires_at")

    def __init__(self, value, ttl: float):
        self.value = value
        self.expires_at = time.time() + ttl


class InMemoryCache:
    def __init__(self, maxsize: int = 128, default_ttl: float = 300.0):
        self._store: dict[str, CacheEntry] = {}
        self._maxsize = maxsize
        self._default_ttl = default_ttl

    def _make_key(self, prefix: str, *args) -> str:
        return f"{prefix}:{','.join(str(a) for a in args)}"

    def get(self, prefix: str, *args):
        key = self._make_key(prefix, *args)
        entry = self._store.get(key)
        if entry is None:
            return None
        if time.time() > entry.expires_at:
            del self._store[key]
            return None
        return entry.value

    def set(self, prefix: str, value, ttl: Optional[float] = None, *args):
        key = self._make_key(prefix, *args)
        if len(self._store) >= self._maxsize:
            oldest = min(self._store, key=lambda k: self._store[k].expires_at)
            del self._store[oldest]
        self._store[key] = CacheEntry(value, ttl or self._default_ttl)


_cache = InMemoryCache()


async def get_travel_time_naver(
    client: httpx.AsyncClient,
    start_coords: tuple[float, float],
    end_coords: tuple[float, float],
    travel_mode: str = "car",
    consider_traffic: bool = True,
) -> Optional[float]:
    """Fetches travel time using Naver Directions API (async)."""
    if travel_mode == "car":
        return await _get_travel_time_car(
            client, start_coords, end_coords, consider_traffic
        )
    elif travel_mode == "transit":
        return await _get_travel_time_transit(client, start_coords, end_coords)
    elif travel_mode == "pedestrian":
        return await _get_travel_time_pedestrian(client, start_coords, end_coords)
    else:
        raise ValueError(f"Unsupported travel mode: {travel_mode}")


async def _get_travel_time_car(
    client: httpx.AsyncClient,
    start_coords: tuple[float, float],
    end_coords: tuple[float, float],
    consider_traffic: bool = True,
) -> Optional[float]:
    """Fetches driving/walking travel time via Naver Directions API."""
    url = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving"
    headers = {
        "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET,
    }
    option = "trafic" if consider_traffic else "nomal"
    params = {
        "start": f"{start_coords[0]},{start_coords[1]}",
        "goal": f"{end_coords[0]},{end_coords[1]}",
        "option": option,
    }

    try:
        response = await client.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        if data.get("code") == 0:
            duration_ms = data["route"]["traoptimal"][0]["summary"]["duration"]
            return duration_ms / 1000.0
        else:
            logger.warning("naver_api_error", message=data.get("message", "Unknown"))
            return None

    except httpx.HTTPError as e:
        logger.error("http_error", error=str(e), url=url)
        return None


async def _get_travel_time_transit(
    client: httpx.AsyncClient,
    start_coords: tuple[float, float],
    end_coords: tuple[float, float],
) -> Optional[float]:
    """Fetches public transit travel time via Naver Directions Transit API."""
    url = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/transit"
    headers = {
        "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET,
    }
    params = {
        "start": f"{start_coords[0]},{start_coords[1]}",
        "goal": f"{end_coords[0]},{end_coords[1]}",
    }

    try:
        response = await client.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        if data.get("code") == 0:
            routes = data.get("route", {})
            transitRoutes = routes.get("transit", [])
            if not transitRoutes:
                pedRoutes = routes.get("pedestrian", [])
                if pedRoutes:
                    duration_ms = pedRoutes[0]["summary"]["duration"]
                    return duration_ms / 1000.0
                return None
            iters = transitRoutes[0].get("itineraries", [])
            if not iters:
                return None
            duration_ms = iters[0].get("totalTime", 0)
            return float(duration_ms) if duration_ms > 0 else None
        else:
            logger.warning(
                "naver_transit_api_error", message=data.get("message", "Unknown")
            )
            return None

    except httpx.HTTPError as e:
        logger.error("http_error_transit", error=str(e), url=url)
        return None


async def _get_travel_time_pedestrian(
    client: httpx.AsyncClient,
    start_coords: tuple[float, float],
    end_coords: tuple[float, float],
) -> Optional[float]:
    """Fetches pedestrian travel time via Naver Directions Pedestrian API."""
    url = "https://naveropenapi.apigw.ntruss.com/map-direction-v1/pedestrian"
    headers = {
        "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET,
    }
    params = {
        "start": f"{start_coords[0]},{start_coords[1]}",
        "goal": f"{end_coords[0]},{end_coords[1]}",
        "footsearch": "0",
    }

    try:
        response = await client.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        if data.get("code") == 0:
            ped_routes = data.get("route", {}).get("pedestrian", [])
            if not ped_routes:
                return None
            duration_ms = ped_routes[0]["summary"]["duration"]
            return duration_ms / 1000.0
        else:
            logger.warning(
                "naver_pedestrian_api_error", message=data.get("message", "Unknown")
            )
            return None

    except httpx.HTTPError as e:
        logger.error("http_error_pedestrian", error=str(e), url=url)
        return None


def _cross(o: Point, a: Point, b: Point) -> float:
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)


def convex_hull(points: list[Point]) -> list[Point]:
    """Graham scan convex hull. Points should be (x, y) tuples."""
    if len(points) <= 1:
        return points

    sorted_pts = sorted(points, key=lambda p: (p.x, p.y))
    lower = []
    for p in sorted_pts:
        while len(lower) >= 2 and _cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)

    upper = []
    for p in reversed(sorted_pts):
        while len(upper) >= 2 and _cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)

    result = lower[:-1] + upper[:-1]
    return result if result else points


def _grid_points(
    start: Point,
    radius_km: float,
    spacing_m: int = 500,
) -> list[Point]:
    lat_deg_per_km = 1 / 111.0
    lon_deg_per_km = 1 / (111.0 * math.cos(math.radians(start.y)))

    delta_lat = radius_km * lat_deg_per_km
    delta_lon = radius_km * lon_deg_per_km

    points = []
    lat = start.y - delta_lat
    while lat <= start.y + delta_lat:
        lon = start.x - delta_lon
        while lon <= start.x + delta_lon:
            points.append(Point(lon, lat))
            lon += (spacing_m / 1000) * lon_deg_per_km
        lat += (spacing_m / 1000) * lat_deg_per_km
    return points


async def generate_isochrone_polygon(
    travel_time_minutes: int,
    travel_mode: str = "car",
    start_point: Optional[Point] = None,
    grid_spacing_meters: int = 500,
    consider_traffic: bool = True,
):
    """
    Generates an isochrone polygon around a start point.
    1. Build grid of candidate points
    2. Call Naver API in parallel (async httpx)
    3. Filter reachable points
    4. Compute convex hull polygon
    """
    if start_point is None:
        raise ValueError("start_point is required")

    cache_key = (
        f"{start_point.x:.6f},{start_point.y:.6f},{travel_time_minutes},{travel_mode}"
    )
    cached = _cache.get("isochrone", cache_key)
    if cached is not None:
        logger.info("cache_hit", key=cache_key)
        return cached

    avg_speed_kmh = 50
    radius_km = max(1.0, (travel_time_minutes / 60) * avg_speed_kmh)

    grid = _grid_points(start_point, radius_km, grid_spacing_meters)
    logger.info(
        "grid_generated",
        radius_km=radius_km,
        grid_size=len(grid),
        spacing_m=grid_spacing_meters,
    )

    async with httpx.AsyncClient(timeout=30.0) as client:
        tasks = [
            get_travel_time_naver(
                client,
                (start_point.x, start_point.y),
                (p.x, p.y),
                travel_mode,
                consider_traffic,
            )
            for p in grid
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    reachable = []
    for point, result in zip(grid, results):
        if isinstance(result, Exception):
            logger.debug("point_fetch_failed", point=point, error=str(result))
            continue
        if result is not None and result <= travel_time_minutes * 60:
            reachable.append(point)

    logger.info("reachable_points", count=len(reachable))

    if len(reachable) < 3:
        if not reachable:
            return None
        coords = [[p.x, p.y] for p in reachable]
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "MultiPoint" if len(coords) > 1 else "Point",
                        "coordinates": coords[0] if len(coords) == 1 else coords,
                    },
                    "properties": {"description": "Reachable point(s)"},
                }
            ],
        }

    hull = convex_hull(reachable)
    polygon_coords = [[p.x, p.y] for p in hull] + [[hull[0].x, hull[0].y]]

    geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {"type": "Polygon", "coordinates": [polygon_coords]},
                "properties": {
                    "description": "Isochrone polygon",
                    "reachable_count": len(reachable),
                    "travel_time_minutes": travel_time_minutes,
                    "travel_mode": travel_mode,
                },
            }
        ],
    }

    _cache.set("isochrone", geojson, 300.0, cache_key)
    return geojson
