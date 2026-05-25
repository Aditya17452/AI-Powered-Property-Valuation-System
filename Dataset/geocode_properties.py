"""
Geocoder Enrichment — Indore Properties
=========================================
Fills in Latitude and Longitude columns using
OpenStreetMap Nominatim (free, no API key needed).

Run AFTER scraper_99acres_indore.py:
    python geocode_properties.py --input indore_properties_scraped.csv

Output:
    indore_properties_enriched.csv
"""

import argparse
import time

import pandas as pd
import requests

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
HEADERS       = {"User-Agent": "IndoreAVM/1.0 (academic project)"}
DELAY_SEC     = 1.2   # Nominatim rate limit: max 1 req/sec

# Cache so same locality isn't re-queried
_cache: dict[str, tuple[float, float] | None] = {}


def geocode_locality(locality: str) -> tuple[float, float] | None:
    if locality in _cache:
        return _cache[locality]

    query = f"{locality}, Indore, Madhya Pradesh, India"
    try:
        resp = requests.get(
            NOMINATIM_URL,
            params={"q": query, "format": "json", "limit": 1},
            headers=HEADERS,
            timeout=10,
        )
        data = resp.json()
        if data:
            result = (float(data[0]["lat"]), float(data[0]["lon"]))
            _cache[locality] = result
            return result
    except Exception as e:
        print(f"  [geocode error] {locality}: {e}")

    _cache[locality] = None
    return None


def enrich(input_file: str, output_file: str):
    df = pd.read_csv(input_file)

    # Only geocode rows missing coords
    missing_mask = df["Latitude"].isna() | (df["Latitude"] == "") | (df["Latitude"] == 0)
    localities   = df.loc[missing_mask, "Locality"].unique()

    print(f"Geocoding {len(localities)} unique localities...")

    for loc in localities:
        result = geocode_locality(loc)
        if result:
            lat, lng = result
            mask = (df["Locality"] == loc) & missing_mask
            df.loc[mask, "Latitude"]  = lat
            df.loc[mask, "Longitude"] = lng
            print(f"  ✓ {loc:30s} → {lat:.5f}, {lng:.5f}")
        else:
            print(f"  ✗ {loc} — not found, using Indore centroid")
            mask = (df["Locality"] == loc) & missing_mask
            df.loc[mask, "Latitude"]  = 22.7196
            df.loc[mask, "Longitude"] = 75.8577
        time.sleep(DELAY_SEC)

    df.to_csv(output_file, index=False)
    print(f"\n✓ Saved {len(df)} enriched records → {output_file}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input",  default="indore_properties_scraped.csv")
    parser.add_argument("--output", default="indore_properties_enriched.csv")
    args = parser.parse_args()
    enrich(args.input, args.output)
