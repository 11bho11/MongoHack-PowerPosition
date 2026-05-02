"""Pydantic v2 data models for all PowerPosition collections."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CalendarEntry(BaseModel):
    date: str  # "YYYY-MM-DD"
    content: str
    source: str  # "manual" | "telegram"
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Session(BaseModel):
    date: str
    content: str
    source: str  # "telegram" | "manual"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CoachingPlan(BaseModel):
    athlete_id: str
    short_term: str
    medium_term: str
    long_term: str
    sessions_since_update: int = 0
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class AgentLog(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    action: str
    reasoning: str
    vector_sources: List[str] = []
    event_type: str  # "action" | "checkpoint" | "plan_update" | "inactivity_check"


class WorkflowState(BaseModel):
    athlete_id: str
    cycle_status: str  # "awaiting" | "logged" | "analyzing" | "updated"
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TrainingDoc(BaseModel):
    content: str
    embedding: List[float]  # 1536 dimensions
    source_url: str
    chunk_index: int
    ingested_at: datetime = Field(default_factory=datetime.utcnow)


class Config(BaseModel):
    telegram_bot_token: Optional[str] = None
    telegram_connected: bool = False
    updated_at: datetime = Field(default_factory=datetime.utcnow)
