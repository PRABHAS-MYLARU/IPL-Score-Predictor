# IPL Score Prediction


## Algorithm
1. Data preprocessing → Feature engineering
2. XGBoost training → MAE: 16.5 runs
3. FastAPI deployment → React Native frontend


## Dataset
- Source: Kaggle IPL (2008-2025)
- Records: 200K+ balls
- Split: 80/20 train/test


## Run Locally
```bash
pip install fastapi uvicorn xgboost pandas scikit-learn joblib
python model_training.py
uvicorn app:app --reload
