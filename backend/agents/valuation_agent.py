from model.predictor import Predictor
import config

predictor = Predictor()

def run(prop: dict) -> dict:
    predicted_value = predictor.predict(prop)
    area = float(prop.get("area_sqft", prop.get("area", 1)))
    # predicted_value is already clamped in predictor.py — recompute per-sqft from it
    predicted_per_sqft = int(predicted_value // area) if area else 0
    confidence_band = {"low": int(predicted_value * 0.95), "high": int(predicted_value * 1.05)}
    locality = prop.get("locality")
    locality_avg = int(config.MARKET_RATES.get(locality, 0) * area) if locality else 0
    ratio = predicted_value / (locality_avg + 1e-6) if locality_avg else 1.0
    if ratio > 1.15:
        verdict = "Above market average - premium location or high demand micro-area"
    elif ratio < 0.85:
        verdict = "Below market average - possible undervaluation or needs attention"
    else:
        verdict = "Fair market value - aligns with Indore locality average"

    return {
        "predicted_value": int(predicted_value),
        "predicted_per_sqft": int(predicted_per_sqft),
        "confidence_band": confidence_band,
        "locality_avg": int(locality_avg),
        "valuation_verdict": verdict
    }
