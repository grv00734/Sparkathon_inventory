import pandas as pd
from prophet import Prophet

def generate_forecast(input_csv, output_csv):
    df = pd.read_csv(input_csv)

    forecast_df = pd.DataFrame()

    for (sku, warehouse), group in df.groupby(['SKU', 'Warehouse']):
        temp = group[['Date', 'Quantity']].rename(columns={'Date': 'ds', 'Quantity': 'y'})
        model = Prophet()
        model.fit(temp)

        future = model.make_future_dataframe(periods=14)
        forecast = model.predict(future)

        result = pd.DataFrame({
            'SKU': sku,
            'Warehouse': warehouse,
            'Date': forecast['ds'],
            'Forecast': forecast['yhat']
        })

        forecast_df = pd.concat([forecast_df, result])

    forecast_df.to_csv(output_csv, index=False)
    print(f"Forecast saved to {output_csv}")