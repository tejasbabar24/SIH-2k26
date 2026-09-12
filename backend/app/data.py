from .models import District, Document


DOCUMENTS = [
    Document(id="doc-001", title="Digital Land Records and Dispute Reduction", type="research_paper", institution="National Institute of Rural Development", state="Maharashtra", district="Pune", year=2025, tags=["land records", "disputes", "digitisation"], summary="Evidence on how interoperable land records can reduce verification delays and disputes.", abstract="This study evaluates digital record modernisation and its influence on resolution time and transparency."),
    Document(id="doc-002", title="Climate-Resilient Land Use Planning Framework", type="policy_paper", institution="Department of Land Resources", state="Rajasthan", district="Jaipur", year=2024, tags=["climate", "land use", "planning"], summary="A framework for integrating drought, heat, and land-use indicators into local planning.", abstract="The framework proposes district-level resilience indicators for evidence-based land-use decisions."),
    Document(id="doc-003", title="District Land Dispute Indicator Dataset", type="dataset", institution="BhuData Research Consortium", state="Karnataka", district="Bengaluru Urban", year=2025, tags=["dataset", "disputes", "district"], summary="Prototype district-level dispute indicators for trend analysis and risk prioritisation."),
    Document(id="doc-004", title="Satellite Monitoring for Land-Use Change", type="case_study", institution="Indian Institute of Remote Sensing", state="Assam", district="Guwahati", year=2024, tags=["satellite", "GIS", "land use"], summary="Case study on remote-sensing signals used to identify rapid land conversion."),
]

DISTRICTS = [
    District(id="pune", name="Pune", state="Maharashtra", latitude=18.5204, longitude=73.8567, disputeRisk=72, climateRisk=48, landUseChange=14.2, infrastructureScore=78, priorityScore=65, population=9429408),
    District(id="nashik", name="Nashik", state="Maharashtra", latitude=19.9975, longitude=73.7898, disputeRisk=64, climateRisk=58, landUseChange=11.5, infrastructureScore=65, priorityScore=64, population=6107187),
    District(id="jaipur", name="Jaipur", state="Rajasthan", latitude=26.9124, longitude=75.7873, disputeRisk=58, climateRisk=76, landUseChange=16.4, infrastructureScore=71, priorityScore=68, population=6663971),
    District(id="bengaluru-urban", name="Bengaluru Urban", state="Karnataka", latitude=12.9716, longitude=77.5946, disputeRisk=69, climateRisk=52, landUseChange=21.3, infrastructureScore=86, priorityScore=67, population=9621551),
    District(id="lucknow", name="Lucknow", state="Uttar Pradesh", latitude=26.8467, longitude=80.9462, disputeRisk=75, climateRisk=61, landUseChange=13.7, infrastructureScore=68, priorityScore=71, population=4589838),
    District(id="ranchi", name="Ranchi", state="Jharkhand", latitude=23.3441, longitude=85.3096, disputeRisk=67, climateRisk=70, landUseChange=10.8, infrastructureScore=56, priorityScore=69, population=2914253),
    District(id="guntur", name="Guntur", state="Andhra Pradesh", latitude=16.3067, longitude=80.4365, disputeRisk=54, climateRisk=69, landUseChange=12.1, infrastructureScore=62, priorityScore=61, population=4889230),
    District(id="guwahati", name="Guwahati", state="Assam", latitude=26.1445, longitude=91.7362, disputeRisk=60, climateRisk=74, landUseChange=18.2, infrastructureScore=59, priorityScore=68, population=963429),
]
