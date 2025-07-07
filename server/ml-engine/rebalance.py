import pandas as pd

def auto_rebalance(forecast_csv, stock_csv, output_csv):
    forecast = pd.read_csv(forecast_csv)
    stock = pd.read_csv(stock_csv)

    merged = forecast.merge(stock, on=['SKU', 'Warehouse'], how='left')
    merged['Available'] = merged['Available'].fillna(0)

    latest = merged[merged['Date'] == merged['Date'].max()].copy()
    latest['Surplus'] = latest['Available'] - latest['Forecast']

    transfers = []

    for sku in latest['SKU'].unique():
        sku_data = latest[latest['SKU'] == sku]
        deficit_warehouses = sku_data[sku_data['Surplus'] < 0].sort_values(by='Surplus')
        surplus_warehouses = sku_data[sku_data['Surplus'] > 0].sort_values(by='Surplus', ascending=False)

        for _, deficit_row in deficit_warehouses.iterrows():
            needed = abs(deficit_row['Surplus'])

            for _, surplus_row in surplus_warehouses.iterrows():
                if needed == 0:
                    break
                transferable = min(needed, surplus_row['Surplus'])
                if transferable <= 0:
                    continue

                transfers.append({
                    'SKU': sku,
                    'From': surplus_row['Warehouse'],
                    'To': deficit_row['Warehouse'],
                    'Quantity': transferable
                })

                surplus_row['Surplus'] -= transferable
                needed -= transferable

    transfer_df = pd.DataFrame(transfers)
    transfer_df.to_csv(output_csv, index=False)
    print(f"Rebalance plan saved to {output_csv}")
