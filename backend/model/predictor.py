import os
import math
import json
import numpy as np
import joblib

import config


class Predictor:
    def __init__(self):
        self.model = None
        self.encoders = None
        self.feature_names = None
        self._load()

    def _load(self):
        if self.model is None:
            model_path = os.path.join(os.path.dirname(__file__), "..", config.MODEL_PATH)
            model_path = os.path.normpath(model_path)
            self.model = joblib.load(model_path)
        if self.encoders is None:
            try:
                enc_path = os.path.join(os.path.dirname(__file__), "..", config.ENCODERS_PATH)
                enc_path = os.path.normpath(enc_path)
                self.encoders = joblib.load(enc_path)
            except Exception:
                # fallback to Dataset path
                enc_path = os.path.join(os.path.dirname(__file__), "..", "..", "Dataset", "label_encoders.pkl")
                enc_path = os.path.normpath(enc_path)
                self.encoders = joblib.load(enc_path)
        if self.feature_names is None:
            fp = os.path.join(os.path.dirname(__file__), "..", config.FEATURES_PATH)
            fp = os.path.normpath(fp)
            if not os.path.exists(fp):
                fp = os.path.join(os.path.dirname(__file__), "..", "..", "Dataset", "feature_names.json")
            with open(fp, "r", encoding="utf-8") as f:
                self.feature_names = json.load(f)

    def predict(self, prop: dict) -> int:
        # feature engineering
        age_map = {"0-5 years":2.5,"5-10 years":7.5,"10-20 years":15,"20+ years":25}
        facing_score = {"North":3,"North-East":4,"East":3,"North-West":2,
                        "South-East":2,"West":1,"South":1,"South-West":0,"Road-facing":3}
        road_score = {"Excellent":4,"Good":3,"Average":2,"Poor":1}
        crime_score = {"Low":3,"Medium":2,"High":1}

        def _coerce_optional_float(value, fallback):
            if value is None or value == "":
                return float(fallback)
            return float(value)

        area = float(prop.get("area_sqft", prop.get("area", 0)))
        log_area = float(np.log1p(area))
        age_numeric = age_map.get(prop.get("age_category", "20+ years"), 25)
        amenity_score = sum(1 for k in ("nearby_schools","nearby_hospitals","nearby_markets") if prop.get(k, "No") == "Yes")
        locality = prop.get("locality", "Vijay Nagar")
        registry_rate = float(prop.get("registry_rate", prop.get("registry_rate_per_sqft", config.CIRCLE_RATES.get(locality, 2500))))
        market_rate = float(prop.get("market_rate", config.MARKET_RATES.get(locality, registry_rate)))
        market_premium_ratio = market_rate / (registry_rate + 1e-6)
        listing_price = prop.get("listing_price")
        listing_rate = (float(listing_price) / area) if listing_price else market_rate
        fallback_lat, fallback_lng = config.LOCALITY_COORDS.get(
            locality, (config.CITY_CENTER_LAT, config.CITY_CENTER_LNG)
        )
        lat = _coerce_optional_float(prop.get("latitude"), fallback_lat)
        lng = _coerce_optional_float(prop.get("longitude"), fallback_lng)
        dist = math.sqrt((lat - config.CITY_CENTER_LAT)**2 + (lng - config.CITY_CENTER_LNG)**2) * 111
        facing = prop.get("facing", "North")
        facing_s = facing_score.get(facing, 2)
        road = prop.get("road_connectivity", "Average")
        road_s = road_score.get(road, 2)
        crime = prop.get("crime_rate", "Medium")
        crime_s = crime_score.get(crime, 2)
        future_flag = 1 if prop.get("future_projects", "No") == "Yes" else 0
        is_owner = 1 if prop.get("owner_type", "Owner") == "Owner" else 0
        property_type = prop.get("property_type", "Apartment")

        # encode locality and property type
        try:
            local_enc = int(self.encoders["Locality"].transform([locality])[0])
        except Exception:
            local_enc = 0
        try:
            prop_enc = int(self.encoders["Property_Type"].transform([property_type])[0])
        except Exception:
            prop_enc = 0

        bhk = int(prop.get("bhk", 1))

        row = [
            area,
            log_area,
            bhk,
            local_enc,
            dist,
            lat,
            lng,
            registry_rate,
            market_rate,
            market_premium_ratio,
            listing_rate,
            age_numeric,
            amenity_score,
            facing_s,
            road_s,
            crime_s,
            future_flag,
            is_owner,
            prop_enc,
        ]

        X = np.array([row])
        try:
            log_pred = float(self.model.predict(X)[0])
        except Exception:
            log_pred = float(self.model.predict(X))
        pred = int(np.expm1(log_pred))
        return pred
