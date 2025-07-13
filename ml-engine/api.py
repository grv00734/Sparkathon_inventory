from flask import Flask, request, jsonify
from prophet import Prophet
import pandas as pd
import os

app = Flask(__name__)

@app.route('/forecast', methods=['POST'])
def forecast():
    data = request.get_json()
    product_id = data.get('productId')
    warehouse_id = data.get('warehouseId')


    if not product_id or not warehouse_id:
        return jsonify({'error': 'productId and warehouseId are required'}), 400

    try:
        print("📥 Incoming request:", data)
        print("🔍 Filtering for product:", product_id, "| warehouse:", warehouse_id)

        # Load the order history CSV
        df = pd.read_csv('orders.csv')
        print("✅ orders.csv loaded with", len(df), "rows")

        # Filter the data for the given SKU and warehouse
        filtered = df[(df['sku_id'] == product_id) & (df['warehouse_id'] == warehouse_id)]
        print("🔎 Filtered rows found:", len(filtered))

        if filtered.empty:
            print("⚠️ No matching sales data found.")
            return jsonify({'error': 'No matching sales data found'}), 404

        # Group by date and sum quantity
        daily_sales = filtered.groupby('date')['quantity_sold'].sum().reset_index()
        print("📊 Grouped daily sales:", daily_sales.shape)

        # Prepare for Prophet
        daily_sales.columns = ['ds', 'y']
        daily_sales['ds'] = pd.to_datetime(daily_sales['ds'])

        # Train the model
        model = Prophet()
        model.fit(daily_sales)
        print("✅ Model trained")

        # Forecast the next 7 days
        future = model.make_future_dataframe(periods=7)
        forecast = model.predict(future)

        # Get only the next 7 days
        future_forecast = forecast.tail(7)[['ds', 'yhat']]
        print("📈 Forecast generated")

        # Format the response
        result = {
            "forecast": [
                {"date": row["ds"].strftime("%Y-%m-%d"), "predicted": round(row["yhat"], 2)}
                for _, row in future_forecast.iterrows()
            ]
        }

        return jsonify(result)

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port)

