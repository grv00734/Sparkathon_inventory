from flask import Flask, request, jsonify
from flask_cors import CORS
from prophet import Prophet
import pandas as pd
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration from environment variables
PORT = int(os.environ.get('PORT', 5002))
HOST = os.environ.get('HOST', '0.0.0.0')
ORDERS_CSV_PATH = os.environ.get('ORDERS_CSV_PATH', 'orders.csv')
FORECAST_DAYS = int(os.environ.get('FORECAST_DAYS', 7))

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'ML Forecasting Engine',
        'version': '1.0.0'
    })

@app.route('/forecast', methods=['POST'])
def forecast():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
            
        product_id = data.get('productId')
        warehouse_id = data.get('warehouseId')

        if not product_id or not warehouse_id:
            return jsonify({'error': 'productId and warehouseId are required'}), 400

        print("📥 Incoming request:", data)
        print("🔍 Filtering for product:", product_id, "| warehouse:", warehouse_id)

        # Check if orders.csv exists
        if not os.path.exists(ORDERS_CSV_PATH):
            return jsonify({'error': f'Orders data file not found: {ORDERS_CSV_PATH}'}), 500

        # Load the order history CSV
        df = pd.read_csv(ORDERS_CSV_PATH)
        print("✅ orders.csv loaded with", len(df), "rows")

        # Validate required columns
        required_columns = ['sku_id', 'warehouse_id', 'date', 'quantity_sold']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return jsonify({
                'error': f'Missing required columns in orders.csv: {missing_columns}'
            }), 500

        # Filter the data for the given SKU and warehouse
        filtered = df[(df['sku_id'] == product_id) & (df['warehouse_id'] == warehouse_id)]
        print("🔎 Filtered rows found:", len(filtered))

        if filtered.empty:
            print("⚠️ No matching sales data found.")
            return jsonify({'error': 'No matching sales data found for the given product and warehouse'}), 404

        # Group by date and sum quantity
        daily_sales = filtered.groupby('date')['quantity_sold'].sum().reset_index()
        print("📊 Grouped daily sales:", daily_sales.shape)

        # Validate we have enough data points
        if len(daily_sales) < 2:
            return jsonify({'error': 'Insufficient data points for forecasting (minimum 2 required)'}), 400

        # Prepare for Prophet
        daily_sales.columns = ['ds', 'y']
        daily_sales['ds'] = pd.to_datetime(daily_sales['ds'])
        daily_sales = daily_sales.sort_values('ds')

        # Ensure no negative values
        daily_sales['y'] = daily_sales['y'].clip(lower=0)

        # Train the model
        model = Prophet(
            daily_seasonality=True,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.05
        )
        model.fit(daily_sales)
        print("✅ Model trained")

        # Forecast the next N days
        future = model.make_future_dataframe(periods=FORECAST_DAYS)
        forecast = model.predict(future)

        # Get only the future predictions
        future_forecast = forecast.tail(FORECAST_DAYS)[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
        print("📈 Forecast generated")

        # Format the response
        result = {
            "productId": product_id,
            "warehouseId": warehouse_id,
            "forecast": [
                {
                    "date": row["ds"].strftime("%Y-%m-%d"),
                    "predicted": max(0, round(row["yhat"], 2)),
                    "lower_bound": max(0, round(row["yhat_lower"], 2)),
                    "upper_bound": max(0, round(row["yhat_upper"], 2))
                }
                for _, row in future_forecast.iterrows()
            ],
            "historical_data_points": len(daily_sales),
            "forecast_days": FORECAST_DAYS
        }

        return jsonify(result)

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host=HOST, port=PORT, debug=True)

