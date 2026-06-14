const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Footer, Header
} = require('docx');
const fs = require('fs');

const BLUE = "1E3A5F";
const LIGHT_BLUE = "D0E4F7";
const ACCENT = "1D4ED8";
const GOLD = "B45309";
const LIGHT_GOLD = "FEF3C7";
const GRAY = "6B7280";
const DARK = "111827";
const WHITE = "FFFFFF";
const LIGHT_GRAY = "F3F4F6";
const GREEN = "065F46";
const LIGHT_GREEN = "D1FAE5";

const border = { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h(text, level, opts = {}) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 400 : 240, after: 160 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: level === HeadingLevel.HEADING_1 ? 36 : level === HeadingLevel.HEADING_2 ? 28 : 24, color: level === HeadingLevel.HEADING_1 ? BLUE : DARK, ...opts })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: DARK, ...opts })]
  });
}

function pb() { return new Paragraph({ children: [new TextRun({ break: 1 })] }); }

function bullet(text, bold_prefix = null) {
  const runs = [];
  if (bold_prefix) {
    runs.push(new TextRun({ text: bold_prefix + ": ", font: "Arial", size: 22, bold: true, color: ACCENT }));
    runs.push(new TextRun({ text, font: "Arial", size: 22, color: DARK }));
  } else {
    runs.push(new TextRun({ text, font: "Arial", size: 22, color: DARK }));
  }
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 60, after: 60 },
    children: runs
  });
}

function kv(key, val, keyColor = ACCENT) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: key + ": ", font: "Arial", size: 22, bold: true, color: keyColor }),
      new TextRun({ text: val, font: "Arial", size: 22, color: DARK })
    ]
  });
}

function sectionDivider(title) {
  return new Paragraph({
    spacing: { before: 320, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
    children: [new TextRun({ text: title, font: "Arial", size: 30, bold: true, color: ACCENT })]
  });
}

function infoBox(rows, headerLabel, headerColor = LIGHT_BLUE) {
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          columnSpan: 2,
          borders,
          shading: { fill: ACCENT, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [new Paragraph({ children: [new TextRun({ text: headerLabel, font: "Arial", size: 22, bold: true, color: WHITE })] })]
        })
      ]
    }),
    ...rows.map(([k, v]) => new TableRow({
      children: [
        new TableCell({
          borders,
          shading: { fill: headerColor, type: ShadingType.CLEAR },
          width: { size: 3200, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: k, font: "Arial", size: 21, bold: true, color: DARK })] })]
        }),
        new TableCell({
          borders,
          width: { size: 6160, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: v, font: "Arial", size: 21, color: DARK })] })]
        })
      ]
    }))
  ];
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [3200, 6160], rows: tableRows });
}

function metricTable(rows) {
  const header = new TableRow({
    children: ['Metric', 'Value', 'Interpretation'].map((h, i) => new TableCell({
      borders,
      shading: { fill: BLUE, type: ShadingType.CLEAR },
      width: { size: [2800, 2200, 4360][i], type: WidthType.DXA },
      margins: { top: 100, bottom: 100, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 21, bold: true, color: WHITE })] })]
    }))
  });
  const dataRows = rows.map(([m, v, i], idx) => new TableRow({
    children: [m, v, i].map((cell, ci) => new TableCell({
      borders,
      shading: { fill: idx % 2 === 0 ? LIGHT_GRAY : WHITE, type: ShadingType.CLEAR },
      width: { size: [2800, 2200, 4360][ci], type: WidthType.DXA },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 21, color: ci === 1 ? (v === cell && cell.includes('%') ? GREEN : DARK) : DARK, bold: ci === 1 })] })]
    }))
  }));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [2800, 2200, 4360], rows: [header, ...dataRows] });
}

function featureTable(features) {
  const header = new TableRow({
    children: ['#', 'Feature Name', 'Description', 'Type'].map((h, i) => new TableCell({
      borders,
      shading: { fill: BLUE, type: ShadingType.CLEAR },
      width: { size: [500, 2200, 5060, 1600][i], type: WidthType.DXA },
      margins: { top: 100, bottom: 100, left: 100, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: WHITE })] })]
    }))
  });
  const rows = features.map(([n, name, desc, type], idx) => new TableRow({
    children: [n, name, desc, type].map((cell, ci) => new TableCell({
      borders,
      shading: { fill: idx % 2 === 0 ? LIGHT_GRAY : WHITE, type: ShadingType.CLEAR },
      width: { size: [500, 2200, 5060, 1600][ci], type: WidthType.DXA },
      margins: { top: 70, bottom: 70, left: 100, right: 100 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 19, color: ci === 1 ? ACCENT : DARK })] })]
    }))
  }));
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [500, 2200, 5060, 1600], rows: [header, ...rows] });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }]
      },
      {
        reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 36, bold: true, font: "Arial" }, paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, font: "Arial" }, paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 24, bold: true, font: "Arial" }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1260, right: 1260, bottom: 1260, left: 1260 } }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT, space: 4 } },
            children: [
              new TextRun({ text: "IntelliValue — AI-Powered Property Valuation System", font: "Arial", size: 18, color: GRAY }),
              new TextRun({ text: "     Technical Documentation v2.0", font: "Arial", size: 18, color: GRAY, italics: true })
            ]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: "D1D5DB", space: 4 } },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Developed by Aditya Chouksey · Darpan Nanpuriya · Yash Joshi  |  Indore, Madhya Pradesh  |  Page ", font: "Arial", size: 18, color: GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: GRAY })
            ]
          })
        ]
      })
    },
    children: [

      // ══════════════════════════════════════
      // TITLE PAGE
      // ══════════════════════════════════════
      new Paragraph({ spacing: { before: 1200, after: 0 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "🏠", size: 72 })] }),
      new Paragraph({ spacing: { before: 200, after: 80 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "IntelliValue", font: "Arial", size: 64, bold: true, color: BLUE })] }),
      new Paragraph({ spacing: { before: 0, after: 60 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "AI-Powered Property Valuation System", font: "Arial", size: 32, color: GRAY })] }),
      new Paragraph({ spacing: { before: 0, after: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Indore, Madhya Pradesh", font: "Arial", size: 26, color: GRAY, italics: true })] }),

      new Table({
        width: { size: 6000, type: WidthType.DXA },
        columnWidths: [2800, 3200],
        rows: [
          ...[
            ["Version", "2.0 (Final)"],
            ["Model", "XGBoost Regressor"],
            ["Model Accuracy (R²)", "0.9953"],
            ["Mean Abs % Error", "2.33%"],
            ["CV R² (5-fold)", "0.9949 ± 0.0016"],
            ["Training Samples", "900 (100 real + 800 synthetic)"],
            ["Features Used", "19 engineered features"],
            ["Localities Covered", "26 (Indore region)"],
            ["LLM Backend", "Groq LLaMA3-8b-8192"],
            ["Framework", "FastAPI + React 18 + Vite"],
          ].map(([k, v]) => new TableRow({
            children: [
              new TableCell({ borders, shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR }, width: { size: 2800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: k, font: "Arial", size: 21, bold: true, color: BLUE })] })] }),
              new TableCell({ borders, width: { size: 3200, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: v, font: "Arial", size: 21, color: DARK })] })] })
            ]
          }))
        ]
      }),

      pb(), pb(),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Aditya Chouksey (Team Leader)  ·  Darpan Nanpuriya  ·  Yash Joshi", font: "Arial", size: 22, color: GRAY })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "sakshamservices2025@gmail.com  |  +91 7999105415", font: "Arial", size: 20, color: GRAY })] }),
      new Paragraph({ pageBreakBefore: true, children: [] }),

      // ══════════════════════════════════════
      // 1. PROBLEM STATEMENT
      // ══════════════════════════════════════
      sectionDivider("1. Problem Statement & Motivation"),
      p("Property valuation in India — particularly in Tier-2 cities like Indore — has historically been an opaque, broker-driven, and inconsistent process. The core problems this project addresses:"),
      pb(),
      bullet("Listing prices ≠ market prices: Platforms like 99acres and MagicBricks show what sellers ask, not what properties actually trade for."),
      bullet("No explainability: Even when ML-based platforms estimate a price, they provide no reasoning — buyers and sellers cannot understand why a property is valued at a certain price."),
      bullet("Tier-2 data scarcity: Most AVMs (Automated Valuation Models) are trained on Tier-1 city data (Mumbai, Delhi, Bengaluru). Indore-specific models did not exist."),
      bullet("Broker dependency: Buyers and sellers rely entirely on brokers whose incentives are not aligned with fair valuation."),
      bullet("Circle rate vs market rate gap: Government circle rates (IGRS MP) in Indore are 30–60% below actual transaction values, making government sources unreliable for fair market estimation."),
      pb(),
      p("IntelliValue addresses all five problems by combining a trained ML model, rule-based validation, and an LLM explanation layer into a transparent 3-agent pipeline."),
      new Paragraph({ pageBreakBefore: true, children: [] }),

      // ══════════════════════════════════════
      // 2. PROJECT EVOLUTION
      // ══════════════════════════════════════
      sectionDivider("2. Project Evolution — From Start to Final Version"),

      h("Phase 1: Initial Concept & Existing System", HeadingLevel.HEADING_2),
      p("The project began with a basic frontend/backend and a CatBoost model trained on approximately 100 manually collected data points — all from the Vigyan Nagar locality only."),
      pb(),
      infoBox([
        ["Model file", "vigyan_nagar_price_model.cbm (CatBoost)"],
        ["Training data", "~100 rows, single locality (Vigyan Nagar)"],
        ["Features", "Basic: BHK, area, listing price, locality"],
        ["Model quality", "Unreliable — too few samples, single locality, no feature engineering"],
        ["Target variable", "Listing price (aspirational, not actual market value)"],
        ["Explainability", "None"],
        ["Agent layer", "None"],
        ["Data source", "Manual collection, MagicBricks listings"],
      ], "Phase 1 State — What Existed Before This Project", LIGHT_GOLD),
      pb(),

      h("Phase 2: Data Strategy — Why Scraping Failed", HeadingLevel.HEADING_2),
      p("The first major technical decision was to expand the dataset. 99acres and MagicBricks were identified as scraping targets. Two scraping attempts were made:"),
      pb(),
      bullet("Attempt 1 (BeautifulSoup + Playwright headless): 99acres served 'Access Denied' — only 315 bytes returned. Cloudflare bot detection blocked all headless requests."),
      bullet("Attempt 2 (debug_99acres.py): Confirmed page title was 'Access Denied', HTML length 315 chars, keyword 'access denied' found in response body."),
      bullet("Root cause: 99acres uses Cloudflare with fingerprinting that detects headless Chromium even with custom User-Agent headers."),
      pb(),
      p("The correct selectors were identified from a visible-browser debug run: tupleNew__outerTupleWrap (25 cards/page), tupleNew__priceValWrap (price), tupleNew__locationName (locality), tupleNew__headingNrera (BHK+type). However, headless mode still failed regardless of selector accuracy."),
      pb(),
      p("Decision: Abandon real-time scraping. Use a statistically grounded synthetic data generator instead, anchored to MP IGRS circle rates and 99acres market research for each Indore locality."),
      pb(),

      h("Phase 3: Synthetic Data Generation", HeadingLevel.HEADING_2),
      p("generate_dataset.py was written to produce 800 statistically grounded synthetic records. The methodology:"),
      pb(),
      bullet("25 Indore localities categorized into 3 tiers: Tier 1 (premium: Palasia, Vijay Nagar, AB Road), Tier 2 (mid: Nipania, Niranjanpur, MR 10), Tier 3 (affordable: Rau, Kanadiya, Banganga)"),
      bullet("Circle rates sourced from igrs.mp.gov.in 2024 data for each locality"),
      bullet("Market multiplier range (circle_rate × multiplier = market_rate) set per tier based on 99acres research: Tier 1: 1.20–1.60x, Tier 2: 1.05–1.35x, Tier 3: 0.98–1.22x"),
      bullet("Property type weights, BHK distribution, area ranges, age distribution — all varied by tier to match real market patterns"),
      bullet("Price formula: base = area × market_rate, then multipliers applied for age (-7% to -25%), facing direction (+4% for NE, -2% for SW), amenity count (+1.5% per amenity), property type (villa +15%, plot -20%)"),
      bullet("Gaussian noise ±5% added to each price to simulate real-world variance"),
      bullet("800 synthetic rows produced, shuffled, and merged with 100 real rows → 900 total"),
      pb(),

      h("Phase 4: Dataset Cleaning & Merging", HeadingLevel.HEADING_2),
      p("The combined dataset (indore_full_dataset.csv, 950 raw rows, 25 columns) had several quality issues from the real data batch (PV101–PV150):"),
      pb(),
      bullet("Duplicate columns: 'Listing price' and 'Listing_price' both present, similarly for 'Data Source'/'Data_Source' — merged using fillna()"),
      bullet("Age_of_Property inconsistency: Some rows had raw integers (7, 3, 12) instead of category strings. Normalized with a mapping function: n ≤ 5 → '0-5 years', n ≤ 10 → '5-10 years', etc."),
      bullet("Owner_Type inconsistency: Values 'Individual' and 'Joint' found instead of 'Owner'/'Dealer'. Normalized: Individual/Owner → 'Owner', Joint/Dealer → 'Dealer'"),
      bullet("Yes/No columns (schools, hospitals, markets): Some rows had numeric proximity values (1.5, 2.3) instead of Yes/No. Normalized: float > 0 → 'Yes', else → 'No'"),
      bullet("50 rows dropped as they had missing values in key columns after cleaning → final clean dataset: 900 rows"),
      new Paragraph({ pageBreakBefore: true, children: [] }),

      // ══════════════════════════════════════
      // 3. ML MODEL
      // ══════════════════════════════════════
      sectionDivider("3. Machine Learning Model — Complete Technical Details"),

      h("3.1 Model Selection & Rationale", HeadingLevel.HEADING_2),
      p("The initial Phase 1 model was CatBoost, chosen because it handles categorical features natively. It was replaced for the following reasons:"),
      pb(),
      bullet("CatBoost on 100 rows: Insufficient data for gradient boosting — model was memorizing, not generalizing"),
      bullet("XGBoost chosen for Phase 2: Better community SHAP integration, more tunable hyperparameters, faster training, and extensive precedent in real estate AVM literature (validated by XGBoost + Extra Trees papers cited in project research)"),
      bullet("Target variable changed: Phase 1 predicted 'Listing price' (what sellers ask). Phase 2 targets 'Market_Rate_per_sqft × Built_up_area_sqfeet' — the estimated true transaction value, not the aspirational listing price"),
      bullet("Log-transformation applied to target: Prices follow a log-normal distribution. Training on log(price) and reversing with expm1() significantly improves RMSE and prevents the model from being dominated by high-value outliers"),
      pb(),

      h("3.2 Feature Engineering — All 19 Features", HeadingLevel.HEADING_2),
      p("Raw columns were transformed into 19 engineered features before training:"),
      pb(),
      featureTable([
        ["1", "Built_up_area_sqfeet", "Raw area in sqft — primary price driver", "Raw"],
        ["2", "Log_Area", "log1p(area) — reduces skew, improves regression fit", "Derived"],
        ["3", "BHK", "Number of bedrooms/halls/kitchens (0 for plots)", "Raw"],
        ["4", "Locality_Enc", "LabelEncoder transform of locality string", "Encoded"],
        ["5", "Dist_City_Center", "Euclidean dist (km) to Palasia roundabout (22.7196, 75.8577)", "Derived"],
        ["6", "Latitude", "GPS latitude — captures micro-location within locality", "Raw"],
        ["7", "Longitude", "GPS longitude — captures east-west gradient of Indore", "Raw"],
        ["8", "Registry_Rate_per_sqft", "MP IGRS 2024 circle rate for the locality (₹/sqft)", "Raw"],
        ["9", "Market_Rate_per_sqft", "Estimated actual market rate from training data", "Raw"],
        ["10", "Market_Premium_Ratio", "market_rate / registry_rate — measures locality premium over govt rate", "Derived"],
        ["11", "Listing_Rate", "listing_price / area — aspirational rate signal (weak feature)", "Derived"],
        ["12", "Age_Numeric", "Midpoint of age category: 0-5→2.5, 5-10→7.5, 10-20→15, 20+→25", "Derived"],
        ["13", "Amenity_Score", "Count of schools + hospitals + markets nearby (0–3)", "Derived"],
        ["14", "Facing_Score", "Ordinal: NE=4, N/E=3, NW/SE=2, W/S=1, SW=0", "Derived"],
        ["15", "Road_Score", "Ordinal: Excellent=4, Good=3, Average=2, Poor=1", "Derived"],
        ["16", "Crime_Score", "Inverted ordinal: Low=3, Medium=2, High=1", "Derived"],
        ["17", "Future_Projects_Flag", "Binary: 1 if future development announced nearby", "Derived"],
        ["18", "Is_Owner", "Binary: 1 if owner listing (typically more accurate price)", "Derived"],
        ["19", "Property_Type_Enc", "LabelEncoder transform of property type string", "Encoded"],
      ]),
      pb(),

      h("3.3 Model Configuration", HeadingLevel.HEADING_2),
      infoBox([
        ["Algorithm", "XGBoost Regressor (xgboost Python library)"],
        ["Model file", "property_valuation_model.pkl (1.0 MB, joblib serialized)"],
        ["n_estimators", "500 trees"],
        ["learning_rate", "0.05 (conservative — prevents overfitting)"],
        ["max_depth", "6 (moderate depth for 19 features)"],
        ["min_child_weight", "3 (regularization)"],
        ["subsample", "0.80 (row sampling per tree)"],
        ["colsample_bytree", "0.80 (feature sampling per tree)"],
        ["reg_alpha", "0.1 (L1 regularization)"],
        ["reg_lambda", "1.0 (L2 regularization)"],
        ["early_stopping_rounds", "30 (stopped at ~499 rounds)"],
        ["eval_metric", "RMSE"],
        ["Target variable", "log1p(Market_Rate_per_sqft × Built_up_area_sqfeet)"],
        ["Prediction reversal", "np.expm1(model.predict(X)[0])"],
      ], "XGBoost Model Configuration"),
      pb(),

      h("3.4 Model Performance Metrics", HeadingLevel.HEADING_2),
      metricTable([
        ["R² Score (Test)", "0.9953", "Explains 99.53% of price variance — excellent fit"],
        ["MAE (Test)", "₹1,22,588", "Average absolute error — about 2.4% of mean price"],
        ["RMSE (Test)", "₹1,81,666", "Root mean squared error"],
        ["MAPE (Test)", "2.33%", "Mean absolute percentage error — very low for real estate"],
        ["5-Fold CV R²", "0.9949 ± 0.0016", "Stable across folds — model is not overfitting"],
        ["Train/Test Split", "720 / 180 rows", "80/20 split, random_state=42"],
        ["Target price range", "₹11,43,982 — ₹2,32,28,184", "Full dataset price range after cleaning"],
        ["Mean target price", "₹47,97,284", "Average estimated market value in dataset"],
      ]),
      pb(),
      p("Sample predictions on held-out test set:"),
      pb(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 3120, 3120],
        rows: [
          new TableRow({
            children: ["Actual (₹)", "Predicted (₹)", "Error %"].map(h => new TableCell({
              borders,
              shading: { fill: BLUE, type: ShadingType.CLEAR },
              width: { size: 3120, type: WidthType.DXA },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 21, bold: true, color: WHITE })] })]
            }))
          }),
          ...([
            ["₹70,27,422", "₹71,79,102", "2.2%"],
            ["₹29,67,070", "₹29,41,176", "0.9%"],
            ["₹55,25,409", "₹55,95,827", "1.3%"],
            ["₹43,60,395", "₹42,72,935", "2.0%"],
            ["₹48,38,730", "₹45,95,278", "5.0%"],
            ["₹27,25,328", "₹27,60,356", "1.3%"],
            ["₹25,32,385", "₹25,17,329", "0.6%"],
            ["₹96,20,748", "₹96,85,731", "0.7%"],
          ].map(([a, p, e], idx) => new TableRow({
            children: [a, p, e].map(cell => new TableCell({
              borders,
              shading: { fill: idx % 2 === 0 ? LIGHT_GRAY : WHITE, type: ShadingType.CLEAR },
              width: { size: 3120, type: WidthType.DXA },
              margins: { top: 70, bottom: 70, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 21, color: DARK })] })]
            }))
          })))
        ]
      }),
      pb(),
      new Paragraph({ pageBreakBefore: true, children: [] }),

      // ══════════════════════════════════════
      // 4. AGENTIC ARCHITECTURE
      // ══════════════════════════════════════
      sectionDivider("4. Agentic Architecture — 3-Agent Pipeline"),
      p("The core innovation of this project over a simple ML API is the 3-agent pipeline. Each agent has a distinct role and runs sequentially on every prediction request."),
      pb(),

      h("Agent 1: Validation Agent (validation_agent.py)", HeadingLevel.HEADING_2),
      p("Type: Rule-based (no LLM). Pure Python logic. Runs before the ML model."),
      pb(),
      infoBox([
        ["Purpose", "Detect garbage inputs before wasting ML computation"],
        ["Rule 1", "If listing_price / area < market_rate × 0.4 → warn 'Listing price too low for locality'"],
        ["Rule 2", "If listing_price / area > market_rate × 2.5 → warn 'Listing price unusually high'"],
        ["Rule 3", "If BHK ≥ 3 AND area < 600 sqft → warn '{BHK}BHK in {area}sqft is too small'"],
        ["Rule 4", "If BHK > 5 → warn 'More than 5 BHK is unusual'"],
        ["Rule 5", "If area > 8000 AND type = Apartment → warn 'Apartment >8000sqft unusual'"],
        ["Output", "{ valid: bool, warnings: list[str], confidence: 'High'/'Medium'/'Low' }"],
        ["Confidence logic", "0 warnings → High, 1 warning → Medium, 2+ warnings → Low"],
      ], "Validation Agent Specification"),
      pb(),

      h("Agent 2: Valuation Agent (valuation_agent.py)", HeadingLevel.HEADING_2),
      p("Type: ML inference. Calls predictor.py which loads the XGBoost model."),
      pb(),
      infoBox([
        ["Purpose", "Predict fair market value using the trained XGBoost model"],
        ["Model loaded", "property_valuation_model.pkl + label_encoders.pkl + feature_names.json"],
        ["Feature pipeline", "Builds all 19 features from raw input (see Section 3.2)"],
        ["Prediction", "log_pred = model.predict(row)[0]; value = int(np.expm1(log_pred))"],
        ["predicted_per_sqft", "predicted_value // area_sqft"],
        ["confidence_band", "{ low: int(predicted × 0.95), high: int(predicted × 1.05) }"],
        ["locality_avg", "MARKET_RATES[locality] × area_sqft (baseline comparison)"],
        ["Verdict logic", "ratio = predicted / locality_avg; >1.15 → Above market, <0.85 → Below market, else → Fair value"],
        ["Output", "predicted_value, predicted_per_sqft, confidence_band, locality_avg, valuation_verdict"],
      ], "Valuation Agent Specification"),
      pb(),

      h("Agent 3: Explanation Agent (explanation_agent.py)", HeadingLevel.HEADING_2),
      p("Type: LLM-based. Uses Groq SDK with LLaMA3 to generate natural language explanation."),
      pb(),
      infoBox([
        ["Purpose", "Explain WHY the property received this valuation in plain English"],
        ["LLM provider", "Groq API (groq Python SDK)"],
        ["Model ID", "llama3-8b-8192"],
        ["API key source", ".env file → GROQ_API_KEY environment variable"],
        ["System prompt", "Expert Indian real estate analyst for Indore. Clear English. Max 4 sentences."],
        ["User prompt inputs", "BHK, property_type, locality, area_sqft, age_category, nearby amenities, road quality, crime rate, predicted_value, predicted_per_sqft, valuation_verdict, locality_avg"],
        ["Output", "Plain-text explanation string (3–4 sentences, locality-specific)"],
        ["Error handling", "If Groq call fails, returns a fallback rule-based explanation string"],
      ], "Explanation Agent Specification"),
      pb(),

      h("4.4 API Request Flow (main.py)", HeadingLevel.HEADING_2),
      p("POST /api/predict sequentially calls all 3 agents and returns a combined response:"),
      pb(),
      bullet("Step 1 → validation_agent.run(data) — rule checks"),
      bullet("Step 2 → valuation_agent.run(data) — XGBoost prediction"),
      bullet("Step 3 → explanation_agent.run(data, step2_result) — Groq LLM explanation"),
      bullet("Response: { predicted_value, predicted_per_sqft, confidence_band, locality_avg, valuation_verdict, explanation_text, validation: { valid, warnings, confidence }, agent_trace: ['validation_agent', 'valuation_agent', 'explanation_agent'] }"),
      new Paragraph({ pageBreakBefore: true, children: [] }),

      // ══════════════════════════════════════
      // 5. BACKEND ARCHITECTURE
      // ══════════════════════════════════════
      sectionDivider("5. Backend Architecture"),

      h("5.1 Stack & File Structure", HeadingLevel.HEADING_2),
      infoBox([
        ["Framework", "FastAPI (Python 3.10+)"],
        ["Server", "Uvicorn ASGI server"],
        ["Port", "8000"],
        ["CORS", "All origins allowed (development config)"],
        ["Entry point", "backend/main.py"],
        ["Config module", "backend/config.py — loads .env, defines CIRCLE_RATES, MARKET_RATES, LOCALITY_COORDS"],
        ["Agents folder", "backend/agents/ — validation_agent.py, valuation_agent.py, explanation_agent.py"],
        ["Model folder", "backend/model/predictor.py — loads pkl files from ../Dataset/"],
        ["Model path", "../Dataset/property_valuation_model.pkl (relative from backend/)"],
        ["Encoders path", "../Dataset/label_encoders.pkl"],
        ["Features path", "../Dataset/feature_names.json"],
      ], "Backend Stack"),
      pb(),

      h("5.2 API Endpoints", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 1200, 6360],
        rows: [
          new TableRow({
            children: ["Endpoint", "Method", "Description"].map(h => new TableCell({
              borders, shading: { fill: BLUE, type: ShadingType.CLEAR },
              width: { size: [1800,1200,6360][["Endpoint","Method","Description"].indexOf(h)], type: WidthType.DXA },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 21, bold: true, color: WHITE })] })]
            }))
          }),
          ...[
            ["/api/predict", "POST", "Main valuation endpoint. Runs all 3 agents. Returns full result with explanation."],
            ["/api/validate", "POST", "Validation agent only. Quick input sanity check without ML prediction."],
            ["/api/localities", "GET", "Returns list of 26 localities with their circle_rates and market_rates."],
            ["/api/health", "GET", "Health check. Returns { status: ok, model: XGBoost + Groq LLaMA3, version: 2.0 }"],
          ].map(([ep, meth, desc], idx) => new TableRow({
            children: [ep, meth, desc].map((cell, ci) => new TableCell({
              borders,
              shading: { fill: idx % 2 === 0 ? LIGHT_GRAY : WHITE, type: ShadingType.CLEAR },
              width: { size: [1800,1200,6360][ci], type: WidthType.DXA },
              margins: { top: 70, bottom: 70, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 20, color: ci === 0 ? ACCENT : DARK, bold: ci === 1 })] })]
            }))
          }))
        ]
      }),
      pb(),
      new Paragraph({ pageBreakBefore: true, children: [] }),

      // ══════════════════════════════════════
      // 6. FRONTEND
      // ══════════════════════════════════════
      sectionDivider("6. Frontend Architecture"),

      infoBox([
        ["Framework", "React 18 + Vite"],
        ["Routing", "React Router v6 (BrowserRouter)"],
        ["Styling", "Pure CSS custom design system (no Tailwind in final version)"],
        ["Font", "Instrument Serif (display) + Geist (body) — Google Fonts"],
        ["API calls", "Axios via src/api/valuationApi.js"],
        ["State management", "React useState / useEffect (no Redux needed)"],
        ["Animations", "CSS keyframe animations + IntersectionObserver for scroll triggers"],
        ["Dev port", "5173 (Vite default)"],
        ["Proxy", "vite.config.js proxies /api → http://localhost:8000"],
      ], "Frontend Stack"),
      pb(),

      h("6.1 Pages", HeadingLevel.HEADING_2),
      bullet("Home (/) — Hero with floating mock result card, animated count-up stats (900+, 26, 2.3%, 3), How It Works 3-step cards, CTA banner"),
      bullet("Valuate (/valuate) — Property input form (14 fields) + Agent Status Bar + Result display with typewriter AI explanation"),
      bullet("History (/history) — Timeline from 3000 BC to 2025 showing evolution of property valuation methods up to AI AVMs"),
      bullet("About (/about) — Project description, tech stack chips, team cards (Aditya Chouksey, Darpan Nanpuriya, Yash Joshi)"),
      bullet("Contact (/contact) — Contact info cards (email, phone, location) + message form with toast notification"),
      pb(),

      h("6.2 Key UI Components", HeadingLevel.HEADING_2),
      bullet("AgentStatusBar — 3-step stepper showing waiting → running (pulse animation) → done (checkmark pop). Timing: step1 at 0ms, step2 at 900ms, step3 at 1900ms, freeze when API returns"),
      bullet("ValuationResult — Price count-up from 0 to final value over 1.5s, confidence band range slider, comparison vs locality average, verdict badge"),
      bullet("ExplanationCard — Typewriter animation rendering LLaMA3 response character by character at 16ms/char"),
      bullet("Toggle switches — Custom CSS toggle components for Yes/No amenity inputs"),
      bullet("StatCard — IntersectionObserver triggers count-up animation only when scrolled into view"),
      new Paragraph({ pageBreakBefore: true, children: [] }),

      // ══════════════════════════════════════
      // 7. DATA
      // ══════════════════════════════════════
      sectionDivider("7. Data — Sources, Schema & Coverage"),

      h("7.1 Dataset Summary", HeadingLevel.HEADING_2),
      infoBox([
        ["Total records (final)", "900 (after cleaning from 950 raw)"],
        ["Real data records", "~100 (PV1–PV100, from MagicBricks listings)"],
        ["Synthetic records", "800 (generated by generate_dataset.py)"],
        ["Localities covered", "26 Indore localities across 3 tiers"],
        ["Property types", "Apartment, Villa, Independent House, Builder Floor, Plot"],
        ["BHK range", "0 (plot) to 5 BHK"],
        ["Area range", "450 sqft to 4,300+ sqft"],
        ["Price range (target)", "₹11,43,982 to ₹2,32,28,184"],
        ["Mean target price", "₹47,97,284"],
        ["Files", "indore_full_dataset.csv (900 rows), indore_properties_800.csv (synthetic only)"],
      ], "Dataset Statistics"),
      pb(),

      h("7.2 Column Schema (22 columns after cleaning)", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 1600, 4960],
        rows: [
          new TableRow({
            children: ["Column", "Type", "Description"].map(h => new TableCell({
              borders, shading: { fill: BLUE, type: ShadingType.CLEAR },
              width: { size: [2800,1600,4960][["Column","Type","Description"].indexOf(h)], type: WidthType.DXA },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: WHITE })] })]
            }))
          }),
          ...[
            ["Listing_price", "float", "What seller asks (₹) — used as weak feature, not target"],
            ["Data_Source", "string", "MB (MagicBricks) or SYN (synthetic)"],
            ["Locality", "string", "One of 26 Indore localities"],
            ["Property_Type", "string", "Apartment / Villa / Independent House / Builder Floor / Plot"],
            ["Built_up_area_sqfeet", "int", "Carpet area in square feet"],
            ["Total_area_sqft", "int", "Same as built-up in this dataset"],
            ["BHK", "int", "Bedrooms (0 for plots)"],
            ["Age_of_Property", "string", "0-5 / 5-10 / 10-20 / 20+ years"],
            ["Facing_direction", "string", "N/S/E/W/NE/NW/SE/SW"],
            ["Nearby_Schools", "string", "Yes / No"],
            ["Nearby_Hospitals", "string", "Yes / No"],
            ["Nearby_Markets", "string", "Yes / No"],
            ["Crime_Rate_Area", "string", "Low / Medium / High"],
            ["Road_Connectivity", "string", "Excellent / Good / Average / Poor"],
            ["Future_Projects", "string", "Yes / No"],
            ["Registry_Rate_per_sqft", "int", "MP IGRS circle rate (₹/sqft)"],
            ["Market_Rate_per_sqft", "int", "Estimated actual market rate (₹/sqft) — used to compute TARGET"],
            ["Last_Registry_Year", "int", "Year of last registration"],
            ["Owner_Type", "string", "Owner / Dealer"],
            ["Latitude", "float", "GPS latitude"],
            ["Longitude", "float", "GPS longitude"],
            ["Target", "float", "Market_Rate_per_sqft × Built_up_area_sqfeet — MODEL TARGET"],
          ].map(([col, type, desc], idx) => new TableRow({
            children: [col, type, desc].map((cell, ci) => new TableCell({
              borders,
              shading: { fill: idx % 2 === 0 ? LIGHT_GRAY : WHITE, type: ShadingType.CLEAR },
              width: { size: [2800,1600,4960][ci], type: WidthType.DXA },
              margins: { top: 60, bottom: 60, left: 100, right: 100 },
              children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 19, color: ci === 0 ? ACCENT : DARK, bold: col === "Target" })] })]
            }))
          }))
        ]
      }),
      pb(),
      new Paragraph({ pageBreakBefore: true, children: [] }),

      // ══════════════════════════════════════
      // 8. RUN INSTRUCTIONS
      // ══════════════════════════════════════
      sectionDivider("8. Setup & Run Instructions"),

      h("8.1 Prerequisites", HeadingLevel.HEADING_2),
      bullet("Python 3.10+ with venv"),
      bullet("Node.js 18+ and npm"),
      bullet("Groq API key (free at console.groq.com) in .env as GROQ_API_KEY=your_key"),
      bullet("All .pkl files in Dataset/ folder: property_valuation_model.pkl, label_encoders.pkl, feature_names.json"),
      pb(),

      h("8.2 Backend", HeadingLevel.HEADING_2),
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [new TextRun({ text: "cd backend", font: "Courier New", size: 20, color: "065F46" })]
      }),
      new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "pip install -r requirements.txt", font: "Courier New", size: 20, color: "065F46" })] }),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "uvicorn main:app --reload --port 8000", font: "Courier New", size: 20, color: "065F46" })] }),
      p("Swagger UI available at: http://localhost:8000/docs"),
      pb(),

      h("8.3 Frontend", HeadingLevel.HEADING_2),
      new Paragraph({ spacing: { before: 80, after: 0 }, children: [new TextRun({ text: "cd frontend", font: "Courier New", size: 20, color: "065F46" })] }),
      new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "npm install", font: "Courier New", size: 20, color: "065F46" })] }),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [new TextRun({ text: "npm run dev", font: "Courier New", size: 20, color: "065F46" })] }),
      p("Frontend runs at: http://localhost:5173"),
      pb(),

      h("8.4 Requirements (backend)", HeadingLevel.HEADING_2),
      p("fastapi, uvicorn, joblib, numpy, pandas, xgboost, scikit-learn, groq, python-dotenv, shap"),
      pb(),

      h("8.5 Requirements (frontend)", HeadingLevel.HEADING_2),
      p("react, react-dom, react-router-dom, axios, vite"),
      new Paragraph({ pageBreakBefore: true, children: [] }),

      // ══════════════════════════════════════
      // 9. WHAT CHANGED
      // ══════════════════════════════════════
      sectionDivider("9. Summary — What Changed From Phase 1 to Final"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 3280, 3880],
        rows: [
          new TableRow({
            children: ["Component", "Phase 1 (Before)", "Phase 2 — Final"].map(h => new TableCell({
              borders, shading: { fill: BLUE, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: h, font: "Arial", size: 20, bold: true, color: WHITE })] })]
            }))
          }),
          ...[
            ["ML Model", "CatBoost (.cbm file)", "XGBoost (.pkl file)"],
            ["Model filename", "vigyan_nagar_price_model.cbm", "property_valuation_model.pkl"],
            ["Training data", "~100 rows, 1 locality", "900 rows, 26 localities"],
            ["Data source", "Manual MagicBricks collection", "100 real + 800 synthetic (statistically grounded)"],
            ["Target variable", "Listing price (aspirational)", "Market_Rate × Area (actual market value)"],
            ["Feature count", "~6 basic features", "19 engineered features"],
            ["Log transform", "No", "Yes — log1p(target), reversed with expm1()"],
            ["Model accuracy", "Unknown / poor", "R²=0.9953, MAPE=2.33%"],
            ["Explainability", "None", "SHAP + Groq LLaMA3 natural language explanation"],
            ["Agent layer", "None", "3-agent pipeline: Validation → Valuation → Explanation"],
            ["LLM integration", "None", "Groq API (llama3-8b-8192)"],
            ["Backend", "Basic, no agents", "FastAPI with 3 agent modules"],
            ["Frontend pages", "3 basic pages", "5 pages including History timeline"],
            ["Animations", "None", "Count-up, typewriter, float, agent pulse"],
            ["Scraping", "Not attempted", "Attempted (blocked by Cloudflare), abandoned"],
          ].map(([comp, before, after], idx) => new TableRow({
            children: [comp, before, after].map((cell, ci) => new TableCell({
              borders,
              shading: { fill: idx % 2 === 0 ? LIGHT_GRAY : WHITE, type: ShadingType.CLEAR },
              margins: { top: 70, bottom: 70, left: 110, right: 110 },
              children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 19, bold: ci === 0, color: ci === 2 ? GREEN : DARK })] })]
            }))
          }))
        ]
      }),
      pb(),
      new Paragraph({ pageBreakBefore: true, children: [] }),

      // ══════════════════════════════════════
      // 10. CONTACT
      // ══════════════════════════════════════
      sectionDivider("10. Project Contact & Credits"),
      pb(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 3120, 3120],
        rows: [
          new TableRow({
            children: [
              ["Aditya Chouksey", "Team Leader & ML Engineer", "AC"],
              ["Darpan Nanpuriya", "Backend Developer", "DN"],
              ["Yash Joshi", "Frontend Developer", "YJ"],
            ].map(([name, role, init]) => new TableCell({
              borders,
              shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR },
              margins: { top: 160, bottom: 160, left: 160, right: 160 },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: init, font: "Arial", size: 40, bold: true, color: ACCENT })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: name, font: "Arial", size: 22, bold: true, color: DARK })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: role, font: "Arial", size: 20, color: GRAY, italics: true })] }),
              ]
            }))
          })
        ]
      }),
      pb(), pb(),
      kv("Email", "sakshamservices2025@gmail.com"),
      kv("Phone", "+91 7999105415"),
      kv("Location", "Indore, Madhya Pradesh, India"),
      kv("Project", "B.Tech Minor Project — AI/ML & Computer Science"),
      pb(), pb(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        children: [new TextRun({ text: "IntelliValue v2.0 — AI-Powered Property Valuation for Indore", font: "Arial", size: 20, color: GRAY, italics: true })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('IntelliValue_Technical_Documentation.docx', buf);
  console.log('done');
});