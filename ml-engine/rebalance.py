import pandas as pd
import json
from collections import defaultdict

# Configuration: thresholds
THRESHOLD_LOW = 20    # Below this → considered understocked
THRESHOLD_HIGH = 100  # Above this → considered overstocked

def generate_rebalance_plan(forecast_csv, current_inventory_csv, output_plan_json):
    # Load forecasted demand
    forecast_df = pd.read_csv(forecast_csv)

    # Aggregate forecast per SKU per warehouse
    forecast_sum = forecast_df.groupby(['SKU', 'Warehouse'])['Forecast'].sum().reset_index()
    forecast_sum = forecast_sum.rename(columns={'Forecast': 'TotalForecast'})

    # Load current inventory
    inventory_df = pd.read_csv(current_inventory_csv)

    # Merge both
    merged_df = pd.merge(inventory_df, forecast_sum, on=['SKU', 'Warehouse'], how='inner')

    # Calculate surplus or deficit
    merged_df['Delta'] = merged_df['Quantity'] - merged_df['TotalForecast']

    # Create a plan
    plan = defaultdict(list)

    for sku in merged_df['SKU'].unique():
        sku_data = merged_df[merged_df['SKU'] == sku]

        overstocked = sku_data[sku_data['Delta'] > THRESHOLD_HIGH].sort_values(by='Delta', ascending=False)
        understocked = sku_data[sku_data['Delta'] < -THRESHOLD_LOW].sort_values(by='Delta')

        for _, under_row in understocked.iterrows():
            deficit = abs(under_row['Delta'])
            for i, over_row in overstocked.iterrows():
                surplus = over_row['Delta']
                if surplus <= 0:
                    continue

                transfer_qty = min(surplus, deficit)

                plan[sku].append({
                    "from": over_row['Warehouse'],
                    "to": under_row['Warehouse'],
                    "quantity": int(transfer_qty)
                })

                # Update surplus/deficit
                overstocked.at[i, 'Delta'] -= transfer_qty
                deficit -= transfer_qty

                if deficit <= 0:
                    break

    # Save plan
    with open(output_plan_json, 'w') as f:
        json.dump(plan, f, indent=2)

    print(f"[✔] Rebalance plan saved to {output_plan_json}")

# Example usage (can be triggered from CLI or scheduler)
if __name__ == "__main__":
    generate_rebalance_plan(
        forecast_csv='forecast_output.csv',
        current_inventory_csv='inventory.csv',
        output_plan_json='rebalance_plan.json'
    )
