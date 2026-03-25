from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

app = FastAPI()
model = joblib.load('model.pkl')
metrics = joblib.load('metrics.pkl')

class PredictionInput(BaseModel):
    batting_team: str = "CSK"
    bowling_team: str = "MI"
    overs: float = 10.0
    wickets: int = 2
    run_rate: float = 8.5

@app.get("/")
def home():
    return {"project": "IPL Score Predictor", "status": "RUNNING"}

@app.post("/predict")
def predict(input: PredictionInput):
    data = pd.DataFrame([input.dict()])
    data = pd.get_dummies(data, columns=['batting_team', 'bowling_team'])
    data = data.reindex(columns=model.feature_names_in_, fill_value=0)
    score = model.predict(data)[0]
    return {"predicted_score": round(score), "range": f"{int(score-10)}-{int(score+10)}"}

@app.post("/predict_win")
def predict_win(input: PredictionInput):
    score = model.predict(data)[0]
    target = 160
    win_prob = 1 / (1 + np.exp(-(score - target) / 20))
    return {
        "predicted_score": round(score),
        "win_probability": f"{win_prob*100:.1f}%",
        "metrics": metrics
    }

@app.get("/metrics")
def get_metrics():
    return metrics
