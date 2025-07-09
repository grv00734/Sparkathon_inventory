import pandas as pd
from prophet import Prophet
from fastapi import FastAPI, Query
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB", "smart_delivery")
COLLECTION = os.getenv("MONGO_COLLECTION", "orders")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/forecast")
def generate_forecast(days: int = Query(default=14, ge=1, le=60)):
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION]

        orders = list(collection.find({}, {"_id": 0, "SKU": 1, "Warehouse": 1, "Date": 1, "Quantity": 1}))
        df = pd.DataFrame(orders)

        if df.empty or not all(col in df.columns for col in ['SKU', 'Warehouse', 'Date', 'Quantity']):
            return JSONResponse(status_code=400, content={"error": "Invalid or missing data in DB."})

        df['Date'] = pd.to_datetime(df['Date'])
        forecast_df = pd.DataFrame()

        for (sku, warehouse), group in df.groupby(['SKU', 'Warehouse']):
            temp = group[['Date', 'Quantity']].rename(columns={'Date': 'ds', 'Quantity': 'y'}).sort_values('ds')
            try:
                model = Prophet()
                model.fit(temp)
                future = model.make_future_dataframe(periods=days)
                forecast = model.predict(future)
                result = pd.DataFrame({
                    'SKU': sku,
                    'Warehouse': warehouse,
                    'Date': forecast['ds'],
                    'Forecast': forecast['yhat']
                })
                forecast_df = pd.concat([forecast_df, result.tail(days)])
            except Exception:
                continue

        return forecast_df.to_dict(orient='records')
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    uvicorn.run("forecast_runner:app", host="0.0.0.0", port=8000, reload=True)
