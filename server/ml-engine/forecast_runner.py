from prophet_model import generate_forecast
from rebalance import auto_rebalance

if __name__ == "__main__":
    INPUT_CSV = "orders.csv"
    FORECAST_CSV = "full_forecast.csv"
    STOCK_CSV = "current_stock.csv"
    TRANSFER_CSV = "transfer_plan.csv"

    print("Generating forecast...")
    generate_forecast(INPUT_CSV, FORECAST_CSV)

    print("Running auto-rebalancer...")
    auto_rebalance(FORECAST_CSV, STOCK_CSV, TRANSFER_CSV)

    print("All done.")
