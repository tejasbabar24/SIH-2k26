from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings
from .data import DISTRICTS, DOCUMENTS
from .models import AIQuery, PolicySimulationRequest
from .services.rag import RagService

app = FastAPI(title="BhuNirnay API", version="0.1.0")
cors_settings = Settings.from_environment()
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_settings.frontend_origins,
    allow_origin_regex=cors_settings.frontend_origin_regex or None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "healthy", "service": "BhuNirnay API"}


@app.get("/ready")
def ready():
    """Check deployment configuration without invoking an external AI request."""
    try:
        Settings.from_environment().validate_rag()
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    return {"status": "ready", "service": "BhuNirnay API"}


@app.get("/api/v1/dashboard")
def dashboard(state: str | None = None, district: str | None = None):
    selected = [item for item in DISTRICTS if (not state or item.state == state) and (not district or item.name == district)]
    selected = selected or DISTRICTS
    average_priority = round(sum(item.priorityScore for item in selected) / len(selected))
    return {
        "metrics": {"researchResources": 12480, "activeProjects": 328, "highPriorityDistricts": 84, "disputeCases": 18540, "climateRiskIndex": 67, "policyImpactScore": 74},
        "charts": {
            "disputeTrend": [{"year": year, "cases": cases} for year, cases in [(2021, 22400), (2022, 21500), (2023, 20550), (2024, 19320), (2025, 18540)]],
            "priorityDistricts": [{"district": item.name, "score": item.priorityScore} for item in sorted(selected, key=lambda x: x.priorityScore, reverse=True)[:5]],
            "landUse": [{"name": "Agriculture", "value": 49}, {"name": "Forest", "value": 22}, {"name": "Built-up", "value": 18}, {"name": "Other", "value": 11}],
        },
        "insight": f"The selected area has an average policy-priority score of {average_priority}/100. Focus on land-record modernisation and climate-resilient planning.",
    }


@app.get("/api/v1/documents")
def list_documents(query: str | None = None, type: str | None = None, state: str | None = None, district: str | None = None, year: int | None = None, topic: str | None = None):
    items = DOCUMENTS
    if query:
        needle = query.lower()
        items = [item for item in items if needle in (item.title + " " + item.summary + " " + " ".join(item.tags)).lower()]
    for field, value in [("type", type), ("state", state), ("district", district), ("year", year)]:
        if value is not None:
            items = [item for item in items if getattr(item, field) == value]
    if topic:
        items = [item for item in items if topic.lower() in " ".join(item.tags).lower()]
    return {"items": items, "total": len(items)}


@app.get("/api/v1/documents/{document_id}")
def document_detail(document_id: str):
    item = next((document for document in DOCUMENTS if document.id == document_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Document not found")
    related = [document for document in DOCUMENTS if document.id != item.id and set(document.tags) & set(item.tags)][:3]
    return {**item.model_dump(), "relatedDocuments": related}


@app.get("/api/v1/districts")
def districts():
    return {"items": DISTRICTS}


@app.post("/api/v1/ai/query")
def ai_query(payload: AIQuery):
    try:
        result = RagService(Settings.from_environment()).answer(payload.question)
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=f"RAG service is not configured: {error}") from error
    except Exception as error:
        # Do not return a fabricated answer when the evidence or AI provider is unavailable.
        raise HTTPException(status_code=503, detail="The evidence assistant is temporarily unavailable. Please retry shortly.") from error

    sources = [
        {
            "id": source["id"],
            "title": source["title"],
            "type": "guideline",
            "institution": "Official Government Source",
            "state": "National",
            "district": "Not applicable",
            "year": 2026,
            "tags": ["rag", "official-source"],
            "summary": f"Retrieved evidence: pages {source['pageStart']}-{source['pageEnd']}; similarity {source['similarity']}.",
            "fileUrl": source["sourceUrl"] or "#",
            "sourceUrl": source["sourceUrl"] or "#",
            "pageStart": source["pageStart"],
            "pageEnd": source["pageEnd"],
            "pageRanges": source["pageRanges"],
            "status": "approved",
        }
        for source in result["sources"]
    ]
    return {
        "answer": result["answer"],
        "confidence": result["confidence"],
        "sources": sources,
        "generationStatus": result.get("generationStatus", "ready"),
    }


@app.post("/api/v1/policy-simulations")
def policy_simulation(payload: PolicySimulationRequest):
    district = next((item for item in DISTRICTS if item.id == payload.districtId), None)
    if not district:
        raise HTTPException(status_code=404, detail="District not found")
    intervention_bonus = 1.2 if "dispute" in payload.intervention.lower() or "record" in payload.intervention.lower() else 1.0
    capacity = min(1.0, (payload.coveragePercent / 100) * (0.55 + min(payload.budget / 100, 0.35)) * (0.75 + payload.timeHorizonYears / 20))
    dispute_reduction = round(min(45, district.disputeRisk * capacity * 0.42 * intervention_bonus), 1)
    resilience = round(min(35, district.climateRisk * capacity * 0.30), 1)
    priority = "High" if district.priorityScore >= 68 else "Medium" if district.priorityScore >= 55 else "Low"
    return {"disputeRiskReductionPercent": dispute_reduction, "resolutionTimeImprovementPercent": round(min(40, dispute_reduction * 1.35), 1), "climateResilienceImprovementPercent": resilience, "implementationPriority": priority, "affectedPopulation": round(district.population * payload.coveragePercent / 100), "explanation": "Estimate uses transparent prototype weights for district risk, coverage, budget capacity, and time horizon. It is decision support, not an official policy determination.", "beforeAfterData": [{"name": "Dispute risk", "before": district.disputeRisk, "after": round(max(0, district.disputeRisk - dispute_reduction), 1)}, {"name": "Climate risk", "before": district.climateRisk, "after": round(max(0, district.climateRisk - resilience), 1)}]}
