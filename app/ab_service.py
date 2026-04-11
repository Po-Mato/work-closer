from datetime import datetime
from typing import Optional
import random
import hashlib

experiments: dict = {}
events: list = []


class Experiment:
    def __init__(self, key: str, variants: dict, active: bool = True):
        self.key = key
        self.variants = variants
        self.active = active
        self.created_at = datetime.utcnow()


class Event:
    def __init__(
        self,
        experiment_key: str,
        variant: str,
        event_type: str,
        user_id: Optional[str] = None,
    ):
        self.experiment_key = experiment_key
        self.variant = variant
        self.event_type = event_type
        self.user_id = user_id
        self.timestamp = datetime.utcnow()


def create_experiment(key: str, variants: dict, active: bool = True) -> Experiment:
    if key in experiments:
        raise ValueError(f"Experiment with key '{key}' already exists")
    total_weight = sum(variants.values())
    if not (0.99 < total_weight < 1.01):
        raise ValueError("Variant weights must sum to 1.0")
    exp = Experiment(key, variants, active)
    experiments[key] = exp
    return exp


def get_experiment(key: str) -> Optional[Experiment]:
    return experiments.get(key)


def get_all_experiments() -> list:
    return [
        {
            "key": exp.key,
            "variants": exp.variants,
            "active": exp.active,
            "created_at": exp.created_at.isoformat(),
        }
        for exp in experiments.values()
    ]


def assign_variant(experiment_key: str, user_id: Optional[str] = None) -> str:
    exp = experiments.get(experiment_key)
    if not exp or not exp.active:
        return "control"
    bucket = (
        int(
            hashlib.md5(
                f"{experiment_key}:{user_id or random.random():.10f}".encode()
            ).hexdigest(),
            16,
        )
        % 10000
    )
    threshold = 0
    for variant, weight in exp.variants.items():
        threshold += int(weight * 10000)
        if bucket < threshold:
            return variant
    return list(exp.variants.keys())[-1]


def track_event(
    experiment_key: str,
    variant: str,
    event_type: str,
    user_id: Optional[str] = None,
) -> Event:
    evt = Event(experiment_key, variant, event_type, user_id)
    events.append(evt)
    return evt


def get_results(experiment_key: str) -> dict:
    exp = experiments.get(experiment_key)
    if not exp:
        return {}

    relevant = [e for e in events if e.experiment_key == experiment_key]

    variant_counts: dict = {}
    event_counts: dict = {}
    for evt in relevant:
        variant_counts.setdefault(evt.variant, 0)
        variant_counts[evt.variant] += 1
        event_counts.setdefault(evt.variant, {}).setdefault(evt.event_type, 0)
        event_counts[evt.variant][evt.event_type] += 1

    return {
        "experiment_key": experiment_key,
        "variants": exp.variants,
        "active": exp.active,
        "total_events": len(relevant),
        "variant_event_counts": event_counts,
    }
