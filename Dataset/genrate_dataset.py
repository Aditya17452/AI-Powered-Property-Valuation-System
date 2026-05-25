"""
Indore Property Dataset Generator
===================================
Generates statistically grounded synthetic property data for Indore.
Based on: MP IGRS circle rates, 99acres market research, Indore locality profiles.

Run:
    python generate_dataset.py

Output:
    indore_properties_800.csv
"""

import random
import math
import pandas as pd
import numpy as np

random.seed(42)
np.random.seed(42)

OUTPUT_FILE = "indore_properties_800.csv"
TARGET_ROWS = 800

# ── Locality profiles ─────────────────────────────────────────────────────────
# Each entry: (circle_rate, market_multiplier, lat, lng, tier)
# market_multiplier: how much above circle rate the market trades
# tier: 1=premium, 2=mid, 3=affordable

LOCALITIES = {
    # Tier 1 — Premium
    "Vijay Nagar":       {"circle": 3200, "mult": (1.25, 1.55), "lat": 22.7454, "lng": 75.9020, "tier": 1},
    "Scheme 54":         {"circle": 2900, "mult": (1.20, 1.50), "lat": 22.7308, "lng": 75.8701, "tier": 1},
    "Palasia":           {"circle": 3500, "mult": (1.30, 1.60), "lat": 22.7244, "lng": 75.8839, "tier": 1},
    "AB Road":           {"circle": 3100, "mult": (1.20, 1.45), "lat": 22.7214, "lng": 75.9124, "tier": 1},
    "Aerodrome Road":    {"circle": 2800, "mult": (1.15, 1.40), "lat": 22.7214, "lng": 75.8012, "tier": 1},

    # Tier 2 — Mid
    "Nipania":           {"circle": 2700, "mult": (1.10, 1.35), "lat": 22.7548, "lng": 75.9201, "tier": 2},
    "Super Corridor":    {"circle": 2400, "mult": (1.05, 1.30), "lat": 22.7880, "lng": 75.9012, "tier": 2},
    "Bhawarkuan":        {"circle": 2500, "mult": (1.10, 1.35), "lat": 22.6954, "lng": 75.8401, "tier": 2},
    "Rajendra Nagar":    {"circle": 2600, "mult": (1.10, 1.30), "lat": 22.7050, "lng": 75.8654, "tier": 2},
    "Mahalaxmi Nagar":   {"circle": 2500, "mult": (1.08, 1.30), "lat": 22.7124, "lng": 75.8590, "tier": 2},
    "Niranjanpur":       {"circle": 2600, "mult": (1.10, 1.32), "lat": 22.7601, "lng": 75.9154, "tier": 2},
    "MR 10":             {"circle": 2600, "mult": (1.08, 1.28), "lat": 22.7701, "lng": 75.9021, "tier": 2},
    "Pipliyahana":       {"circle": 2500, "mult": (1.05, 1.28), "lat": 22.6987, "lng": 75.9201, "tier": 2},
    "Pardesipura":       {"circle": 2300, "mult": (1.05, 1.25), "lat": 22.7654, "lng": 75.8734, "tier": 2},
    "Tilak Nagar":       {"circle": 2400, "mult": (1.05, 1.25), "lat": 22.7201, "lng": 75.8654, "tier": 2},

    # Tier 3 — Affordable
    "Annapurna":         {"circle": 2300, "mult": (1.02, 1.20), "lat": 22.6854, "lng": 75.8634, "tier": 3},
    "Bicholi Mardana":   {"circle": 2200, "mult": (1.00, 1.18), "lat": 22.7801, "lng": 75.9301, "tier": 3},
    "Kanadiya":          {"circle": 2000, "mult": (1.00, 1.20), "lat": 22.8012, "lng": 75.8934, "tier": 3},
    "Banganga":          {"circle": 2100, "mult": (1.00, 1.18), "lat": 22.7124, "lng": 75.8301, "tier": 3},
    "LIG Colony":        {"circle": 2200, "mult": (1.00, 1.15), "lat": 22.7301, "lng": 75.8501, "tier": 3},
    "Sudama Nagar":      {"circle": 2200, "mult": (1.00, 1.15), "lat": 22.6901, "lng": 75.8401, "tier": 3},
    "Rau":               {"circle": 1800, "mult": (1.00, 1.18), "lat": 22.6501, "lng": 75.8101, "tier": 3},
    "Limbodi":           {"circle": 1900, "mult": (0.98, 1.15), "lat": 22.8201, "lng": 75.9101, "tier": 3},
    "Bicholi Hapsi":     {"circle": 2100, "mult": (1.00, 1.18), "lat": 22.7901, "lng": 75.9401, "tier": 3},
    "Silicon City":      {"circle": 2300, "mult": (1.02, 1.22), "lat": 22.7401, "lng": 75.8801, "tier": 3},
}

# ── Property type weights per tier ────────────────────────────────────────────
TYPE_WEIGHTS = {
    1: {"Apartment": 0.55, "Villa": 0.20, "Independent House": 0.15, "Builder Floor": 0.10},
    2: {"Apartment": 0.50, "Builder Floor": 0.20, "Independent House": 0.20, "Villa": 0.10},
    3: {"Apartment": 0.40, "Independent House": 0.30, "Builder Floor": 0.20, "Plot": 0.10},
}

# ── BHK distribution per tier ─────────────────────────────────────────────────
BHK_WEIGHTS = {
    1: [0.05, 0.30, 0.45, 0.20],   # 1,2,3,4 BHK
    2: [0.10, 0.40, 0.40, 0.10],
    3: [0.20, 0.45, 0.30, 0.05],
}
BHK_VALUES = [1, 2, 3, 4]

# ── Area ranges per BHK (sqft) ────────────────────────────────────────────────
AREA_RANGE = {
    1: (450,  750),
    2: (750,  1200),
    3: (1100, 1800),
    4: (1600, 2800),
}

# Area bonus for villas/independent houses
TYPE_AREA_BONUS = {
    "Apartment": 1.0,
    "Builder Floor": 1.0,
    "Independent House": 1.3,
    "Villa": 1.6,
    "Plot": 1.2,
}

# ── Other categorical fields ──────────────────────────────────────────────────
FACING_DIRS   = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"]
FACING_WEIGHTS= [0.20,    0.15,    0.25,   0.15,   0.10,         0.05,         0.05,          0.05]

AGE_CATS      = ["0-5 years",  "5-10 years", "10-20 years", "20+ years"]

# Age distribution varies by tier (newer construction in premium areas)
AGE_WEIGHTS = {
    1: [0.45, 0.30, 0.20, 0.05],
    2: [0.35, 0.30, 0.25, 0.10],
    3: [0.25, 0.30, 0.30, 0.15],
}

CRIME_LEVELS  = ["Low", "Medium", "High"]
ROAD_LEVELS   = ["Excellent", "Good", "Average", "Poor"]

# Crime / road quality biased by tier
CRIME_WEIGHTS = {
    1: [0.60, 0.35, 0.05],
    2: [0.35, 0.50, 0.15],
    3: [0.20, 0.50, 0.30],
}
ROAD_WEIGHTS = {
    1: [0.35, 0.45, 0.15, 0.05],
    2: [0.15, 0.45, 0.30, 0.10],
    3: [0.05, 0.30, 0.40, 0.25],
}

YES_NO = ["Yes", "No"]

# ── Helpers ───────────────────────────────────────────────────────────────────

def weighted_choice(options, weights):
    return random.choices(options, weights=weights, k=1)[0]

def jitter(lat, lng, radius_km=0.4):
    """Add small random offset to coordinates within radius."""
    dlat = random.uniform(-radius_km/111, radius_km/111)
    dlng = random.uniform(-radius_km/111, radius_km/111)
    return round(lat + dlat, 6), round(lng + dlng, 6)

def compute_amenity_prob(tier, prop_type):
    """Probability of Yes for schools/hospitals/markets nearby."""
    base = {1: 0.75, 2: 0.55, 3: 0.35}[tier]
    if prop_type in ["Apartment", "Builder Floor"]:
        base += 0.10
    return min(base, 0.90)

def compute_price(area, market_rate_sqft, prop_type, age, facing, amenity_score):
    """
    Base price = area × market_rate
    Then apply multipliers for various factors.
    """
    base = area * market_rate_sqft

    # Age discount
    age_mult = {"0-5 years": 1.00, "5-10 years": 0.93,
                "10-20 years": 0.85, "20+ years": 0.75}[age]

    # Facing premium
    facing_mult = {
        "North": 1.03, "East": 1.02, "North-East": 1.04,
        "North-West": 1.01, "South": 0.99, "West": 0.99,
        "South-East": 1.00, "South-West": 0.98,
    }.get(facing, 1.00)

    # Amenity score (0–3 amenities present)
    amenity_mult = 1.0 + amenity_score * 0.015

    # Property type premium
    type_mult = {
        "Apartment": 1.00, "Builder Floor": 0.95,
        "Independent House": 1.05, "Villa": 1.15, "Plot": 0.80,
    }.get(prop_type, 1.00)

    price = base * age_mult * facing_mult * amenity_mult * type_mult

    # Add Gaussian noise (±5%)
    noise = np.random.normal(1.0, 0.05)
    price = int(price * noise)

    return max(price, 500_000)  # floor at 5 lakhs


# ── Main generator ────────────────────────────────────────────────────────────

def generate():
    records = []

    # Distribute rows proportionally across localities
    # Premium localities get more rows (more listings in reality)
    tier_row_count = {1: 280, 2: 320, 3: 200}
    locality_names = list(LOCALITIES.keys())

    # Assign rows per locality based on tier
    rows_per_locality = {}
    tier_localities = {1: [], 2: [], 3: []}
    for loc, info in LOCALITIES.items():
        tier_localities[info["tier"]].append(loc)

    for tier, total in tier_row_count.items():
        locs = tier_localities[tier]
        base = total // len(locs)
        remainder = total % len(locs)
        for i, loc in enumerate(locs):
            rows_per_locality[loc] = base + (1 if i < remainder else 0)

    idx = 1
    for loc_name, n_rows in rows_per_locality.items():
        info = LOCALITIES[loc_name]
        tier = info["tier"]

        for _ in range(n_rows):
            # Property type
            types = list(TYPE_WEIGHTS[tier].keys())
            type_w = list(TYPE_WEIGHTS[tier].values())
            prop_type = weighted_choice(types, type_w)

            # BHK (plots get N/A → use 0)
            if prop_type == "Plot":
                bhk = 0
                area_range = AREA_RANGE[2]  # use 2BHK range for plot area
            else:
                bhk = weighted_choice(BHK_VALUES, BHK_WEIGHTS[tier])
                area_range = AREA_RANGE[bhk]

            # Area
            area_bonus = TYPE_AREA_BONUS[prop_type]
            area = int(random.triangular(
                area_range[0] * area_bonus,
                area_range[1] * area_bonus,
                (area_range[0] + area_range[1]) / 2 * area_bonus
            ))

            # Age
            age = weighted_choice(AGE_CATS, AGE_WEIGHTS[tier])

            # Facing
            facing = weighted_choice(FACING_DIRS, FACING_WEIGHTS)

            # Amenities
            prob = compute_amenity_prob(tier, prop_type)
            nearby_schools   = "Yes" if random.random() < prob       else "No"
            nearby_hospitals = "Yes" if random.random() < prob * 0.9 else "No"
            nearby_markets   = "Yes" if random.random() < prob * 1.1 else "No"
            amenity_score = [nearby_schools, nearby_hospitals, nearby_markets].count("Yes")

            # Crime & road
            crime = weighted_choice(CRIME_LEVELS, CRIME_WEIGHTS[tier])
            road  = weighted_choice(ROAD_LEVELS,  ROAD_WEIGHTS[tier])

            # Future projects (more likely in tier 2/3 developing areas)
            future_prob = {1: 0.20, 2: 0.40, 3: 0.50}[tier]
            future_projects = "Yes" if random.random() < future_prob else "No"

            # Owner type
            owner_type = weighted_choice(["Owner", "Dealer"], [0.45, 0.55])

            # Market rate per sqft
            mult = random.uniform(*info["mult"])
            market_rate = int(info["circle"] * mult)

            # Registry rate = circle rate with small noise
            registry_rate = int(info["circle"] * random.uniform(0.97, 1.03))

            # Listing price (what seller asks — typically 5-15% above market)
            listing_mult  = random.uniform(1.05, 1.18)
            listing_price = compute_price(area, market_rate * listing_mult,
                                          prop_type, age, facing, amenity_score)

            # Last registry year
            age_year_map = {
                "0-5 years":   random.randint(2020, 2024),
                "5-10 years":  random.randint(2015, 2019),
                "10-20 years": random.randint(2005, 2014),
                "20+ years":   random.randint(1990, 2004),
            }
            last_reg_year = age_year_map[age]

            # Coordinates
            lat, lng = jitter(info["lat"], info["lng"])

            records.append({
                "Property_ID":            f"PV{idx:04d}",
                "Listing_price":          listing_price,
                "Data_Source":            "SYN",
                "Locality":               loc_name,
                "Property_Type":          prop_type,
                "Built_up_area_sqfeet":   area,
                "Total_area_sqft":        area,
                "BHK":                    bhk,
                "Age_of_Property":        age,
                "Facing_direction":       facing,
                "Nearby_Schools":         nearby_schools,
                "Nearby_Hospitals":       nearby_hospitals,
                "Nearby_Markets":         nearby_markets,
                "Crime_Rate_Area":        crime,
                "Road_Connectivity":      road,
                "Future_Projects":        future_projects,
                "Registry_Rate_per_sqft": registry_rate,
                "Market_Rate_per_sqft":   market_rate,
                "Last_Registry_Year":     last_reg_year,
                "Owner_Type":             owner_type,
                "Latitude":               lat,
                "Longitude":              lng,
            })
            idx += 1

    df = pd.DataFrame(records)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)  # shuffle
    df["Property_ID"] = [f"PV{i+1:04d}" for i in range(len(df))]   # re-index

    df.to_csv(OUTPUT_FILE, index=False)

    print(f"✓ Generated {len(df)} records → {OUTPUT_FILE}\n")
    print("── Distribution summary ──")
    print(df["Locality"].value_counts().to_string())
    print(f"\n── Price stats (Listing price) ──")
    print(df["Listing_price"].describe().apply(lambda x: f"₹{x:,.0f}").to_string())
    print(f"\n── Market rate per sqft ──")
    print(df["Market_Rate_per_sqft"].describe().to_string())
    print(f"\n── Property type mix ──")
    print(df["Property_Type"].value_counts().to_string())
    print(f"\n── Sample rows ──")
    print(df[["Locality","Property_Type","BHK","Built_up_area_sqfeet",
              "Market_Rate_per_sqft","Listing_price"]].head(8).to_string())

if __name__ == "__main__":
    generate()
    
    real = pd.read_csv("D:\\Ai Powered Property Valuation System\\property-valuation-ui\\Dataset\\vigyan_nagar_property_data (1) - Sheet1 (1).csv")
    synthetic = pd.read_csv("indore_properties_800.csv")
    combined = pd.concat([real, synthetic], ignore_index=True)
    combined.to_csv("indore_full_dataset.csv", index=False)
    print(f"Total: {len(combined)} rows")