import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor
import joblib

# Sample IPL data (for demo - replace with Kaggle CSV)
data = {
    'batting_team': ['CSK']*50 + ['MI']*50,
    'bowling_team': ['MI']*50 + ['CSK']*50,
    'overs': np.random.uniform(5, 19, 100),
    'wickets': np.random.randint(0, 8, 100),
    'run_rate': np.random.uniform(5, 12, 100),
    'total_score': np.random.randint(120, 220, 100)
}
df = pd.DataFrame(data)
df['run_rate'] = df['total_runs'] / (df['overs'] + 1)

# Features
features = ['batting_team', 'bowling_team', 'overs', 'wickets', 'run_rate']
X = pd.get_dummies(df[features])
y = df['total_score']

# Split & Train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print(f"MAE: {mae:.2f}, RMSE: {rmse:.2f}, R²: {r2:.3f}")

# Save
joblib.dump(model, 'model.pkl')
joblib.dump({'mae': mae, 'rmse': rmse, 'r2': r2}, 'metrics.pkl')
print("✅ Model trained & saved!")
