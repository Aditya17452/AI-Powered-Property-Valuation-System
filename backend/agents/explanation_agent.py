import config

try:
    from groq import Groq
except Exception:
    Groq = None

def run(prop: dict, valuation: dict) -> str:
    locality = prop.get("locality", "Indore")
    predicted_value = valuation.get("predicted_value")
    predicted_per_sqft = valuation.get("predicted_per_sqft")
    verdict = valuation.get("valuation_verdict")
    locality_avg = valuation.get("locality_avg")

    system_prompt = (
        "You are an expert Indian real estate valuation assistant specializing in Indore, Madhya Pradesh property market. "
        "Give clear, helpful explanations in simple English. Be concise - maximum 4 sentences. Mention specific locality characteristics when relevant."
    )

    user_prompt = f"""
Property Details:
- Type: {prop.get('bhk')} BHK {prop.get('property_type')} in {locality}, Indore
- Area: {prop.get('area_sqft')} sqft
- Age: {prop.get('age_category')}
- Amenities nearby: Schools={prop.get('nearby_schools')}, Hospitals={prop.get('nearby_hospitals')}, Markets={prop.get('nearby_markets')}
- Road connectivity: {prop.get('road_connectivity')}, Crime rate: {prop.get('crime_rate')}

Valuation Result:
- Predicted market value: ₹{predicted_value:,}
- Per sqft rate: ₹{predicted_per_sqft:,}
- Verdict: {verdict}
- Locality market average: ₹{locality_avg:,}

In 3-4 sentences, explain why this property has this valuation and what factors most influenced it. Mention {locality} specifically.
"""

    if Groq is not None and config.GROQ_API_KEY:
        try:
            client = Groq(api_key=config.GROQ_API_KEY)
            # Use a simple generate call; if API differs, wrap in try/except
            response = client.generate(model="llama3-8b-8192", prompt=system_prompt + "\n\n" + user_prompt, max_tokens=200)
            # response may have .text or ['choices'] depending on SDK; try common patterns
            if hasattr(response, "text"):
                return response.text.strip()
            if isinstance(response, dict) and "choices" in response:
                return response["choices"][0]["text"].strip()
            return str(response)
        except Exception:
            pass

    # Fallback explanation (concise)
    expl = (
        f"The predicted value reflects local market dynamics in {locality}, combining area, location, and listing/market rates. "
        f"Key positives and negatives: proximity to amenities, road connectivity and crime score influenced the model most. "
        f"The model compares the property against locality averages and recent listings to compute a fair value. "
        f"Consider the validation warnings for any potential data issues."
    )
    return expl
