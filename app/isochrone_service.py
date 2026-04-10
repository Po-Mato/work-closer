import os
import requests
import json
import math # For basic geometry calculations

# Naver API credentials (to be loaded from environment variables)
NAVER_CLIENT_ID = os.getenv("NAVER_CLIENT_ID")
NAVER_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET")

# Dummy Point class for basic coordinate handling
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

async def get_travel_time_naver(start_coords: tuple, end_coords: tuple, travel_mode: str = "car"):
    """
    Fetches travel time between two coordinates using Naver Directions API.
    start_coords: (longitude, latitude)
    end_coords: (longitude, latitude)
    travel_mode: "car", "transit", "walk", "bicycle"
    """
    url = ""
    if travel_mode == "car":
        url = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving"
    # TODO: Add other travel modes (transit, walk, bicycle)
    else:
        raise ValueError("Unsupported travel mode")

    headers = {
        "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET
    }
    params = {
        "start": f"{start_coords[0]},{start_coords[1]}",
        "goal": f"{end_coords[0]},{end_coords[1]}",
        "option": "trafic", # For car: "trafic" for real-time traffic, "realtime" for estimated
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        if travel_mode == "car" and data.get("code") == 0:
            # For car, get total travel time in seconds
            return data["route"]["trafic"][0]["summary"]["duration"] / 1000 # convert ms to seconds
        else:
            # Handle other travel modes and errors
            print(f"Error from Naver API: {data.get('message', 'Unknown error')}")
            return None

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

async def generate_isochrone_polygon(
    start_point: Point,
    travel_time_minutes: int,
    travel_mode: str = "car",
    grid_spacing_meters: int = 500
):
    """
    Generates an isochrone polygon around a start point.
    For now, this is a simplified implementation that returns reachable points.
    """
    # 1. Define a bounding box around the start point
    # Approximate conversion of degrees to meters for a rough bounding box
    # This needs to be more accurate with projection, but for simplification:
    lat_deg_per_km = 1 / 111.0
    lon_deg_per_km = 1 / (111.0 * math.cos(math.radians(start_point.y))) # Cosine for longitude scaling

    bbox_radius_km = travel_time_minutes / 60 * 50 # Assuming average speed of 50 km/h (rough estimate)
    if bbox_radius_km < 1: # Ensure a minimum search radius
        bbox_radius_km = 1
    
    delta_lat = bbox_radius_km * lat_deg_per_km
    delta_lon = bbox_radius_km * lon_deg_per_km

    north = start_point.y + delta_lat
    south = start_point.y - delta_lat
    east = start_point.x + delta_lon
    west = start_point.x - delta_lon

    # 2. Create a grid of points within the bounding box
    grid_points = []
    current_lat = south
    while current_lat <= north:
        current_lon = west
        while current_lon <= east:
            grid_points.append(Point(current_lon, current_lat))
            current_lon += (grid_spacing_meters / 1000) * lon_deg_per_km # Approximate conversion
        current_lat += (grid_spacing_meters / 1000) * lat_deg_per_km # Approximate conversion

    reachable_points_coords = []
    # Implement asynchronous parallel calls to Naver API (TODO for future)
    # For demonstration, sequential calls
    for point in grid_points:
        travel_time_seconds = await get_travel_time_naver(
            (start_point.x, start_point.y), (point.x, point.y), travel_mode
        )
        if travel_time_seconds is not None and travel_time_seconds <= travel_time_minutes * 60:
            reachable_points_coords.append([point.x, point.y]) # GeoJSON format [longitude, latitude]

    if not reachable_points_coords:
        return None

    # 3. Return the reachable points as a GeoJSON MultiPoint or a simple list
    # For now, we'll return a simple GeoJSON FeatureCollection of points
    # A proper isochrone polygon generation requires more advanced algorithms
    # which we are avoiding due to library issues.

    # Simplified convex hull using basic math if no dedicated library is available
    # This is a very rough approximation and not a true isochrone polygon
    if len(reachable_points_coords) > 2:
        # Find min/max lat/lon to form a bounding box polygon for now
        min_lon = min(p[0] for p in reachable_points_coords)
        max_lon = max(p[0] for p in reachable_points_coords)
        min_lat = min(p[1] for p in reachable_points_coords)
        max_lat = max(p[1] for p in reachable_points_coords)

        # Create a simple bounding box polygon
        polygon_coords = [\
            [min_lon, min_lat],\
            [max_lon, min_lat],\
            [max_lon, max_lat],\
            [min_lon, max_lat],\
            [min_lon, min_lat] # Close the polygon\
        ]
        
        geojson_polygon = {\
            "type": "FeatureCollection",\
            "features": [\
                {\
                    "type": "Feature",\
                    "geometry": {\
                        "type": "Polygon",\
                        "coordinates": [\n                            polygon_coords\n                        ]\n                    },\n                    "properties": {\n                        "description": "Approximate isochrone bounding box"\n                    }\n                }\
            ]\
        }\"
        return geojson_polygon
    elif reachable_points_coords:
        # If only 1 or 2 points, return as MultiPoint or Point
        if len(reachable_points_coords) == 1:
            return {\
                "type": "FeatureCollection",\
                "features": [\
                    {\
                        "type": "Feature",\
                        "geometry": {\
                            "type": "Point",\
                            "coordinates": reachable_points_coords[0]\
                        },\n                        "properties": {\n                            "description": "Reachable point"\n                        }\n                    }\
                ]\
            }\"
        else: # 2 points
            return {\
                "type": "FeatureCollection",\
                "features": [\
                    {\
                        "type": "Feature",\
                        "geometry": {\
                            "type": "MultiPoint",\
                            "coordinates": reachable_points_coords\
                        },\n                        "properties": {\n                            "description": "Reachable points"\n                        }\n                    }\
                ]\
            }\"
    else:
        return None
