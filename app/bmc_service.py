from datetime import datetime
from typing import Optional
import uuid

canvas_store: dict = {}


class BusinessModelCanvasModel:
    def __init__(
        self,
        id: str,
        key_partners: str,
        key_activities: str,
        key_resources: str,
        value_propositions: str,
        customer_relationships: str,
        channels: str,
        customer_segments: str,
        cost_structure: str,
        revenue_streams: str,
        created_at: datetime,
        updated_at: datetime,
    ):
        self.id = id
        self.key_partners = key_partners
        self.key_activities = key_activities
        self.key_resources = key_resources
        self.value_propositions = value_propositions
        self.customer_relationships = customer_relationships
        self.channels = channels
        self.customer_segments = customer_segments
        self.cost_structure = cost_structure
        self.revenue_streams = revenue_streams
        self.created_at = created_at
        self.updated_at = updated_at


def create_bmc() -> BusinessModelCanvasModel:
    now = datetime.utcnow()
    bmc = BusinessModelCanvasModel(
        id=str(uuid.uuid4()),
        key_partners="",
        key_activities="",
        key_resources="",
        value_propositions="",
        customer_relationships="",
        channels="",
        customer_segments="",
        cost_structure="",
        revenue_streams="",
        created_at=now,
        updated_at=now,
    )
    canvas_store[bmc.id] = bmc
    return bmc


def get_bmc(id: str) -> Optional[BusinessModelCanvasModel]:
    return canvas_store.get(id)


def get_all_bmcs() -> list[BusinessModelCanvasModel]:
    return list(canvas_store.values())


def update_bmc(
    id: str,
    key_partners: Optional[str] = None,
    key_activities: Optional[str] = None,
    key_resources: Optional[str] = None,
    value_propositions: Optional[str] = None,
    customer_relationships: Optional[str] = None,
    channels: Optional[str] = None,
    customer_segments: Optional[str] = None,
    cost_structure: Optional[str] = None,
    revenue_streams: Optional[str] = None,
) -> Optional[BusinessModelCanvasModel]:
    bmc = canvas_store.get(id)
    if not bmc:
        return None
    if key_partners is not None:
        bmc.key_partners = key_partners
    if key_activities is not None:
        bmc.key_activities = key_activities
    if key_resources is not None:
        bmc.key_resources = key_resources
    if value_propositions is not None:
        bmc.value_propositions = value_propositions
    if customer_relationships is not None:
        bmc.customer_relationships = customer_relationships
    if channels is not None:
        bmc.channels = channels
    if customer_segments is not None:
        bmc.customer_segments = customer_segments
    if cost_structure is not None:
        bmc.cost_structure = cost_structure
    if revenue_streams is not None:
        bmc.revenue_streams = revenue_streams
    bmc.updated_at = datetime.utcnow()
    return bmc


def delete_bmc(id: str) -> bool:
    if id in canvas_store:
        del canvas_store[id]
        return True
    return False
