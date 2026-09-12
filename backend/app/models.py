from typing import Literal

from pydantic import BaseModel, Field


DocumentType = Literal["research_paper", "policy_paper", "dataset", "case_study", "legal_document", "guideline", "report"]


class Document(BaseModel):
    id: str
    title: str
    type: DocumentType
    institution: str
    state: str
    district: str
    year: int
    tags: list[str]
    summary: str
    fileUrl: str = "#"
    status: Literal["approved", "pending"] = "approved"
    abstract: str | None = None


class District(BaseModel):
    id: str
    name: str
    state: str
    latitude: float
    longitude: float
    disputeRisk: int = Field(ge=0, le=100)
    climateRisk: int = Field(ge=0, le=100)
    landUseChange: float
    infrastructureScore: int = Field(ge=0, le=100)
    priorityScore: int = Field(ge=0, le=100)
    population: int


class AIQuery(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    userRole: str
    filters: dict[str, object] | None = None


class PolicySimulationRequest(BaseModel):
    districtId: str
    intervention: str
    budget: float = Field(ge=0)
    coveragePercent: float = Field(ge=0, le=100)
    timeHorizonYears: int = Field(ge=1, le=20)
