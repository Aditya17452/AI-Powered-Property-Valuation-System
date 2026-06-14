def run(prop: dict) -> dict:
    warnings = []
    listing_price = prop.get("listing_price")
    area = float(prop.get("area_sqft", prop.get("area", 0)))
    locality = prop.get("locality")
    market_rate = prop.get("market_rate")
    # Use MARKET_RATES fallback if not provided
    import config
    if market_rate is None and locality:
        market_rate = config.MARKET_RATES.get(locality)

    if listing_price and area and market_rate:
        rate = float(listing_price) / area
        if rate < market_rate * 0.4:
            warnings.append("Listing price seems too low for this locality")
        if rate > market_rate * 2.5:
            warnings.append("Listing price seems unusually high for this locality")

    bhk = int(prop.get("bhk", 0))
    if bhk >= 3 and area < 600:
        warnings.append(f"{bhk}BHK in {int(area)}sqft is too small - please verify")
    if bhk > 5:
        warnings.append("More than 5 BHK is unusual - please verify")
    property_type = prop.get("property_type", "Apartment")
    if area > 8000 and property_type == "Apartment":
        warnings.append("Apartment above 8000 sqft is unusual")
    if property_type == "Apartment" and area > 5000:
        warnings.append(f"{int(area)} sqft is unusually large for an Apartment — did you mean Independent House or Villa?")

    valid = len(warnings) == 0
    confidence = "High" if len(warnings) == 0 else ("Medium" if len(warnings) == 1 else "Low")
    return {"valid": valid, "warnings": warnings, "confidence": confidence}
