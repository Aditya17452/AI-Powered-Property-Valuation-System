from dotenv import load_dotenv
import os
import json

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL_PATH = "../Dataset/property_valuation_model.pkl"
ENCODERS_PATH = "../Dataset/label_encoders.pkl"
FEATURES_PATH = "../Dataset/feature_names.json"

CITY_CENTER_LAT = 22.7196
CITY_CENTER_LNG = 75.8577

CIRCLE_RATES = {
  "Vijay Nagar":3200,"Scheme 54":2900,"Palasia":3500,
  "AB Road":3100,"Aerodrome Road":2800,"Nipania":2700,
  "Super Corridor":2400,"Bhawarkuan":2500,"Rajendra Nagar":2600,
  "Mahalaxmi Nagar":2500,"Niranjanpur":2600,"MR 10":2600,
  "Pipliyahana":2500,"Pardesipura":2300,"Tilak Nagar":2400,
  "Annapurna":2300,"Bicholi Mardana":2200,"Kanadiya":2000,
  "Banganga":2100,"LIG Colony":2200,"Sudama Nagar":2200,
  "Rau":1800,"Limbodi":1900,"Bicholi Hapsi":2100,
  "Silicon City":2300,"Vigyan Nagar":2800
}

MARKET_RATES = {
  "Vijay Nagar":4200,"Scheme 54":3800,"Palasia":5200,
  "AB Road":4100,"Aerodrome Road":3600,"Nipania":3300,
  "Super Corridor":2800,"Bhawarkuan":3100,"Rajendra Nagar":3100,
  "Mahalaxmi Nagar":3000,"Niranjanpur":3200,"MR 10":3100,
  "Pipliyahana":2900,"Pardesipura":2600,"Tilak Nagar":2800,
  "Annapurna":2500,"Bicholi Mardana":2400,"Kanadiya":2200,
  "Banganga":2300,"LIG Colony":2400,"Sudama Nagar":2400,
  "Rau":2000,"Limbodi":2100,"Bicholi Hapsi":2300,
  "Silicon City":2600,"Vigyan Nagar":3200
}

LOCALITY_COORDS = {
  "Vijay Nagar":(22.7454,75.9020),"Scheme 54":(22.7308,75.8701),
  "Palasia":(22.7244,75.8839),"AB Road":(22.7214,75.9124),
  "Aerodrome Road":(22.7214,75.8012),"Nipania":(22.7548,75.9201),
  "Super Corridor":(22.7880,75.9012),"Bhawarkuan":(22.6954,75.8401),
  "Rajendra Nagar":(22.7050,75.8654),"Mahalaxmi Nagar":(22.7124,75.8590),
  "Niranjanpur":(22.7601,75.9154),"MR 10":(22.7701,75.9021),
  "Pipliyahana":(22.6987,75.9201),"Pardesipura":(22.7654,75.8734),
  "Tilak Nagar":(22.7201,75.8654),"Annapurna":(22.6854,75.8634),
  "Bicholi Mardana":(22.7801,75.9301),"Kanadiya":(22.8012,75.8934),
  "Banganga":(22.7124,75.8301),"LIG Colony":(22.7301,75.8501),
  "Sudama Nagar":(22.6901,75.8401),"Rau":(22.6501,75.8101),
  "Limbodi":(22.8201,75.9101),"Bicholi Hapsi":(22.7901,75.9401),
  "Silicon City":(22.7401,75.8801),"Vigyan Nagar":(22.7196,75.8577)
}

KNOWN_LOCALITIES = list(CIRCLE_RATES.keys())
