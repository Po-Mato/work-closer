# Work Closer - Isochrone API

This project implements an Isochrone API for the "Work Closer" MVP, allowing users to find areas reachable within a specified travel time from a given location.

## Features

*   **AI-Powered Isochrone Generation**: Utilizes Naver Directions API to calculate travel times and generate isochrone polygons.
*   **Flexible Travel Modes**: Supports various travel modes (car, public transit, walking, cycling - *future implementation*).
*   **Performance Optimization**: Implements data caching to minimize API calls and manage costs.
*   **GeoJSON Output**: Provides isochrone polygon data in standard GeoJSON format for easy integration with frontend map UIs.

## Technology Stack

*   **Backend**: Python with FastAPI
*   **Geospatial Libraries**: None currently (simplified approach), previously intended `shapely`, `geopandas`, `networkx`, `osmnx`
*   **API**: Naver Directions API

## Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Po-Mato/work-closer.git
    cd work-closer
    ```

2.  **Create a virtual environment (optional but recommended)**:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r app/requirements.txt
    ```

4.  **Configure Environment Variables**:
    Create a `.env` file in the `app/` directory based on `.env.example`:
    ```
    NAVER_CLIENT_ID="YOUR_NAVER_CLIENT_ID"
    NAVER_CLIENT_SECRET="YOUR_NAVER_CLIENT_SECRET"
    ```
    Replace `YOUR_NAVER_CLIENT_ID` and `YOUR_NAVER_CLIENT_SECRET` with your actual Naver API credentials.

## Running the Application

To start the FastAPI application, navigate to the `app/` directory and run:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://0.0.0.0:8000`.

## API Endpoints (Future)

*   `GET /isochrone`: Generate an isochrone polygon.

## Development Notes

*   The `isochrone_service.py` file contains the core logic for isochrone generation, including Naver API integration and geospatial processing.
*   Performance optimization, including caching strategies for Naver API calls, is crucial for cost management and responsiveness.
*   The current implementation uses a simplified grid and bounding box approach for polygon generation due to compatibility issues with advanced geospatial libraries on Python 3.14.3. More advanced techniques (e.g., proper concave hull algorithms) will be explored in future iterations once library compatibility is resolved.
