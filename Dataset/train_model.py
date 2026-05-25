"""
Indore Property Valuation — Full Training Pipeline
=====================================================
Steps:
  1. Load & merge columns
  2. Clean inconsistent values
  3. Feature engineering
  4. Train XGBoost
  5. Evaluate + SHAP
  6. Save model

Run:
    pip install pandas numpy scikit-learn xgboost shap matplotlib
    python train_model.py
"""

import warnings
warnings.filterwarnings("ignore")

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb
import shap
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import joblib
import json

INPUT_FILE  = "indore_full_dataset.csv"   # your merged file
MODEL_FILE  = "property_valuation_model.pkl"
ENCODER_FILE= "label_encoders.pkl"
FEATURES_FILE = "feature_names.json"

# ── 1. LOAD ───────────────────────────────────────────────────────────────────

print("=" * 60)
print("STEP 1: Loading data")
print("=" * 60)

df = pd.read_csv(INPUT_FILE)
print(f"Raw shape: {df.shape}")

# ── 2. MERGE DUPLICATE COLUMNS ────────────────────────────────────────────────

# Fix: Listing_price column (some rows use 'Listing price', others 'Listing_price')
if "Listing_price" in df.columns and "Listing price" in df.columns:
    df["Listing_price"] = df["Listing_price"].fillna(df["Listing price"])
elif "Listing price" in df.columns:
    df.rename(columns={"Listing price": "Listing_price"}, inplace=True)

# Fix: Data_Source
if "Data_Source" in df.columns and "Data Source" in df.columns:
    df["Data_Source"] = df["Data_Source"].fillna(df["Data Source"])
elif "Data Source" in df.columns:
    df.rename(columns={"Data Source": "Data_Source"}, inplace=True)

# Drop redundant columns
drop_cols = ["Listing price", "Data Source", "Remarks",
             "Property_ID"]  # ID is not a feature
df.drop(columns=[c for c in drop_cols if c in df.columns], inplace=True)

print(f"After column merge: {df.shape}")

# ── 3. CLEAN ──────────────────────────────────────────────────────────────────

print("\nSTEP 2: Cleaning")

# Target: use Market_Rate_per_sqft × Built_up_area_sqfeet as ground truth
# This is more robust than Listing_price (which is aspirational)
df["Target"] = df["Market_Rate_per_sqft"] * df["Built_up_area_sqfeet"]

# Drop rows with missing target
df = df.dropna(subset=["Target"])
df = df[df["Target"] > 0]

# Fix Age_of_Property — normalize to category
def normalize_age(val):
    val = str(val).strip()
    if val in ["0-5 years", "5-10 years", "10-20 years", "20+ years"]:
        return val
    try:
        n = float(val)
        if n <= 5:  return "0-5 years"
        elif n <= 10: return "5-10 years"
        elif n <= 20: return "10-20 years"
        else: return "20+ years"
    except:
        return "0-5 years"

df["Age_of_Property"] = df["Age_of_Property"].apply(normalize_age)

# Fix Owner_Type
def normalize_owner(val):
    val = str(val).strip().lower()
    if "individual" in val or "joint" in val or "owner" in val:
        return "Owner"
    return "Dealer"

df["Owner_Type"] = df["Owner_Type"].apply(normalize_owner)

# Fix Yes/No columns — some rows have numeric proximity values
yes_no_cols = ["Nearby_Schools", "Nearby_Hospitals", "Nearby_Markets", "Future_Projects"]
def normalize_yesno(val):
    val = str(val).strip().lower()
    if val in ["yes", "1", "true"]: return "Yes"
    if val in ["no", "0", "false"]: return "No"
    try:
        return "Yes" if float(val) > 0 else "No"
    except:
        return "Unknown"

for col in yes_no_cols:
    df[col] = df[col].apply(normalize_yesno)

# Fix Road_Connectivity — 'Excellent' → treat as better than 'Good'
# Keep as is, encoder will handle it

# Drop rows still missing key fields
key_cols = ["Locality", "Property_Type", "Built_up_area_sqfeet",
            "BHK", "Age_of_Property", "Market_Rate_per_sqft",
            "Registry_Rate_per_sqft", "Latitude", "Longitude"]
df = df.dropna(subset=key_cols)
df = df[df["Built_up_area_sqfeet"] > 0]
df = df[df["BHK"] >= 0]

print(f"Clean shape: {df.shape}")
print(f"Target range: ₹{df['Target'].min():,.0f} — ₹{df['Target'].max():,.0f}")
print(f"Target mean:  ₹{df['Target'].mean():,.0f}")

# ── 4. FEATURE ENGINEERING ────────────────────────────────────────────────────

print("\nSTEP 3: Feature engineering")

# Numerical: amenity score
df["Amenity_Score"] = (
    (df["Nearby_Schools"]   == "Yes").astype(int) +
    (df["Nearby_Hospitals"] == "Yes").astype(int) +
    (df["Nearby_Markets"]   == "Yes").astype(int)
)

# Market premium over circle rate
df["Market_Premium_Ratio"] = (
    df["Market_Rate_per_sqft"] / df["Registry_Rate_per_sqft"].replace(0, 1)
)

# Age as numeric (midpoint of range)
age_map = {"0-5 years": 2.5, "5-10 years": 7.5, "10-20 years": 15, "20+ years": 25}
df["Age_Numeric"] = df["Age_of_Property"].map(age_map)

# Log area (reduces skew)
df["Log_Area"] = np.log1p(df["Built_up_area_sqfeet"])

# Price per sqft (from listing — weak signal, but useful)
df["Listing_Rate"] = df["Listing_price"] / df["Built_up_area_sqfeet"].replace(0, 1)
df["Listing_Rate"] = df["Listing_Rate"].fillna(df["Market_Rate_per_sqft"])

# Distance from city center (Palasia roundabout: 22.7196, 75.8577)
CITY_CENTER_LAT = 22.7196
CITY_CENTER_LNG = 75.8577
df["Dist_City_Center"] = np.sqrt(
    (df["Latitude"]  - CITY_CENTER_LAT) ** 2 +
    (df["Longitude"] - CITY_CENTER_LNG) ** 2
) * 111  # rough km conversion

# Facing premium score
facing_score = {
    "North": 3, "North-East": 4, "East": 3,
    "North-West": 2, "South-East": 2,
    "West": 1, "South": 1, "South-West": 0,
    "Road-facing": 3, "Unknown": 1
}
df["Facing_Score"] = df["Facing_direction"].map(facing_score).fillna(1)

# Road quality score
road_score = {"Excellent": 4, "Good": 3, "Average": 2, "Poor": 1}
df["Road_Score"] = df["Road_Connectivity"].map(road_score).fillna(2)

# Crime score (inverted — lower crime = higher score)
crime_score = {"Low": 3, "Medium": 2, "High": 1}
df["Crime_Score"] = df["Crime_Rate_Area"].map(crime_score).fillna(2)

# Future projects flag
df["Future_Projects_Flag"] = (df["Future_Projects"] == "Yes").astype(int)

# Owner type flag
df["Is_Owner"] = (df["Owner_Type"] == "Owner").astype(int)

# Log target (reduces skew, improves regression)
df["Log_Target"] = np.log1p(df["Target"])

print("Engineered features added.")

# ── 5. ENCODE CATEGORICALS ────────────────────────────────────────────────────

cat_cols = ["Locality", "Property_Type", "Age_of_Property"]
label_encoders = {}

for col in cat_cols:
    le = LabelEncoder()
    df[col + "_Enc"] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le

# ── 6. SELECT FEATURES ────────────────────────────────────────────────────────

FEATURES = [
    # Core property
    "Built_up_area_sqfeet", "Log_Area", "BHK",
    # Location
    "Locality_Enc", "Dist_City_Center", "Latitude", "Longitude",
    # Rates
    "Registry_Rate_per_sqft", "Market_Rate_per_sqft",
    "Market_Premium_Ratio", "Listing_Rate",
    # Quality signals
    "Age_Numeric", "Amenity_Score", "Facing_Score",
    "Road_Score", "Crime_Score",
    # Flags
    "Future_Projects_Flag", "Is_Owner",
    # Property type
    "Property_Type_Enc",
]

TARGET = "Log_Target"

X = df[FEATURES].copy()
y = df[TARGET].copy()

print(f"\nFeature matrix: {X.shape}")
print(f"Features used: {FEATURES}")

# ── 7. TRAIN / TEST SPLIT ─────────────────────────────────────────────────────

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"\nTrain: {len(X_train)} | Test: {len(X_test)}")

# ── 8. TRAIN XGBOOST ─────────────────────────────────────────────────────────

print("\nSTEP 4: Training XGBoost")

model = xgb.XGBRegressor(
    n_estimators     = 500,
    learning_rate    = 0.05,
    max_depth        = 6,
    min_child_weight = 3,
    subsample        = 0.8,
    colsample_bytree = 0.8,
    reg_alpha        = 0.1,
    reg_lambda       = 1.0,
    random_state     = 42,
    n_jobs           = -1,
    eval_metric      = "rmse",
)

try:
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=50,
        early_stopping_rounds=30,
    )
except TypeError:
    # Some xgboost versions expect early stopping via callbacks
    try:
        model.fit(
            X_train, y_train,
            eval_set=[(X_test, y_test)],
            verbose=50,
            callbacks=[xgb.callback.EarlyStopping(rounds=30)]
        )
    except Exception as e:
        print(f"Warning: early stopping not applied: {e}")
        model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=50)

# ── 9. EVALUATE ───────────────────────────────────────────────────────────────

print("\nSTEP 5: Evaluation")

y_pred_log = model.predict(X_test)
y_pred     = np.expm1(y_pred_log)
y_true     = np.expm1(y_test)

mae  = mean_absolute_error(y_true, y_pred)
rmse = np.sqrt(mean_squared_error(y_true, y_pred))
r2   = r2_score(y_true, y_pred)
denom = np.where(y_true == 0, 1, y_true)
mape = np.mean(np.abs((y_true - y_pred) / denom)) * 100

print(f"\n── Test set metrics ──")
print(f"  MAE  : ₹{mae:>12,.0f}")
print(f"  RMSE : ₹{rmse:>12,.0f}")
print(f"  R²   : {r2:.4f}")
print(f"  MAPE : {mape:.2f}%")

# Cross-validation
cv = KFold(n_splits=5, shuffle=True, random_state=42)
cv_r2 = cross_val_score(
    xgb.XGBRegressor(
        n_estimators=300, learning_rate=0.05, max_depth=6,
        subsample=0.8, colsample_bytree=0.8, random_state=42, n_jobs=-1
    ),
    X, y, cv=cv, scoring="r2"
)
print(f"\n  5-Fold CV R²: {cv_r2.mean():.4f} ± {cv_r2.std():.4f}")

# Sample predictions
print(f"\n── Sample predictions (test set) ──")
sample = pd.DataFrame({
    "Actual (₹)":    y_true.values[:8],
    "Predicted (₹)": y_pred[:8],
    "Error %":       np.abs((y_true.values[:8] - y_pred[:8]) / y_true.values[:8]) * 100
})
print(sample.applymap(lambda x: f"₹{x:,.0f}" if x > 100 else f"{x:.1f}%").to_string())

# ── 10. FEATURE IMPORTANCE PLOT ───────────────────────────────────────────────

print("\nSTEP 6: Saving outputs")

# XGBoost built-in importance
fig, ax = plt.subplots(figsize=(10, 7))
xgb.plot_importance(model, ax=ax, max_num_features=15,
                    importance_type="gain", title="Feature Importance (Gain)")
plt.tight_layout()
plt.savefig("feature_importance.png", dpi=150)
plt.close()
print("Saved: feature_importance.png")

# ── 11. SHAP ──────────────────────────────────────────────────────────────────

try:
    explainer   = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test)

    # Summary plot
    fig = plt.figure(figsize=(10, 7))
    shap.summary_plot(shap_values, X_test, feature_names=FEATURES,
                      show=False, plot_size=(10, 7))
    plt.tight_layout()
    plt.savefig("shap_summary.png", dpi=150, bbox_inches="tight")
    plt.close()
    print("Saved: shap_summary.png")

    # Save SHAP explainer for API use
    joblib.dump(explainer, "shap_explainer.pkl")
    print("Saved: shap_explainer.pkl")
except Exception as e:
    print(f"SHAP skipped: {e}")

# ── 12. SAVE MODEL ────────────────────────────────────────────────────────────

joblib.dump(model,          MODEL_FILE)
joblib.dump(label_encoders, ENCODER_FILE)

with open(FEATURES_FILE, "w") as f:
    json.dump(FEATURES, f, indent=2)

print(f"\nSaved: {MODEL_FILE}")
print(f"Saved: {ENCODER_FILE}")
print(f"Saved: {FEATURES_FILE}")

# ── 13. PREDICTION FUNCTION (for API) ─────────────────────────────────────────

def predict_property(
    locality, property_type, area_sqft, bhk, age_category,
    registry_rate, market_rate, lat, lng,
    nearby_schools="No", nearby_hospitals="No", nearby_markets="No",
    facing="North", road_connectivity="Good", crime_rate="Medium",
    future_projects="No", owner_type="Owner", listing_price=None
):
    """
    Returns predicted market value and SHAP explanation dict.
    """
    age_num = age_map.get(age_category, 7.5)
    amenity = sum([nearby_schools=="Yes", nearby_hospitals=="Yes", nearby_markets=="Yes"])
    market_premium = market_rate / max(registry_rate, 1)
    listing_rate   = listing_price / area_sqft if listing_price else market_rate
    log_area = np.log1p(area_sqft)
    dist_cc  = np.sqrt((lat - CITY_CENTER_LAT)**2 + (lng - CITY_CENTER_LNG)**2) * 111

    # Encode locality
    le_loc  = label_encoders["Locality"]
    le_type = label_encoders["Property_Type"]
    try:
        loc_enc  = le_loc.transform([locality])[0]
    except:
        loc_enc  = 0
    try:
        type_enc = le_type.transform([property_type])[0]
    except:
        type_enc = 0

    row = pd.DataFrame([{
        "Built_up_area_sqfeet":    area_sqft,
        "Log_Area":                log_area,
        "BHK":                     bhk,
        "Locality_Enc":            loc_enc,
        "Dist_City_Center":        dist_cc,
        "Latitude":                lat,
        "Longitude":               lng,
        "Registry_Rate_per_sqft":  registry_rate,
        "Market_Rate_per_sqft":    market_rate,
        "Market_Premium_Ratio":    market_premium,
        "Listing_Rate":            listing_rate,
        "Age_Numeric":             age_num,
        "Amenity_Score":           amenity,
        "Facing_Score":            facing_score.get(facing, 1),
        "Road_Score":              road_score.get(road_connectivity, 2),
        "Crime_Score":             crime_score.get(crime_rate, 2),
        "Future_Projects_Flag":    int(future_projects == "Yes"),
        "Is_Owner":                int(owner_type == "Owner"),
        "Property_Type_Enc":       type_enc,
    }])

    log_pred = model.predict(row)[0]
    predicted_value = np.expm1(log_pred)

    # SHAP explanation
    try:
        explainer_loaded = joblib.load("shap_explainer.pkl")
        sv = explainer_loaded.shap_values(row)[0]
        shap_dict = dict(zip(FEATURES, [round(float(v), 2) for v in sv]))
        top_factors = sorted(shap_dict.items(), key=lambda x: abs(x[1]), reverse=True)[:5]
    except:
        top_factors = []

    return {
        "predicted_value": round(predicted_value),
        "predicted_per_sqft": round(predicted_value / area_sqft),
        "top_factors": top_factors
    }

# Quick sanity check
print("\n── Sanity check: sample prediction ──")
result = predict_property(
    locality="Vijay Nagar", property_type="Apartment",
    area_sqft=1200, bhk=3, age_category="0-5 years",
    registry_rate=3200, market_rate=4200,
    lat=22.745, lng=75.902,
    nearby_schools="Yes", nearby_hospitals="Yes",
    road_connectivity="Good", crime_rate="Low"
)
print(f"  Vijay Nagar 3BHK 1200sqft: ₹{result['predicted_value']:,.0f}")
print(f"  Per sqft: ₹{result['predicted_per_sqft']:,.0f}")
print(f"  Top factors: {result['top_factors']}")

print("\n✓ Pipeline complete.")