from fastapi import FastAPI
import yfinance as yf
from supabase import create_client
import os
from dotenv import load_dotenv
from datetime import datetime
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

app = FastAPI()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

#################################################################
# Helper Functions
#################################################################

def get_stock_history(ticker: str, period: str = "3mo"):
    """
    Downloads historical stock data from Yahoo Finance.

    Parameters:
        ticker (str): Stock symbol (e.g., AAPL)
        period (str): Time period to retrieve

    Returns:
        pandas.DataFrame
    """

    stock = yf.Ticker(ticker.upper())

    return stock.history(period=period)
#################################################################

def calculate_stock_metrics(df):
    """
    Calculates key financial metrics from historical stock data.

    Parameters:
        df (DataFrame): Historical stock prices

    Returns:
        dict: Calculated metrics
    """

    current_price = float(df["Close"].iloc[-1])

    returns = (
        (df["Close"].iloc[-1] - df["Close"].iloc[0])
        / df["Close"].iloc[0]
    ) * 100

    volatility = df["Close"].pct_change().std() * 100

    ma_7 = df["Close"].tail(7).mean()

    ma_30 = df["Close"].tail(30).mean()

    return {
        "price": round(current_price, 2),
        "return_pct": round(float(returns), 2),
        "volatility_pct": round(float(volatility), 2),
        "ma_7": round(float(ma_7), 2),
        "ma_30": round(float(ma_30), 2)
    }

#################################################################

@app.get("/")
def home():
    return {"message": "Market Intelligence API running"}

#################################################################

@app.get("/stock/{ticker}")
def get_stock(ticker: str):

    stock = yf.Ticker(ticker)
    data = stock.history(period="1d")

    if data.empty:
        return {"error": "Invalid ticker"}

    latest = data.tail(1).iloc[0]

    price = float(latest["Close"])
    volume = int(latest["Volume"])

    # Save to DB
    supabase.table("stock_prices").insert({
        "ticker": ticker.upper(),
        "price": price,
        "volume": volume,
        "timestamp": str(datetime.now())
    }).execute()

    return {
        "ticker": ticker.upper(),
        "price": round(price, 2),
        "volume": volume
    }

################################################################

@app.get("/history/{ticker}")
def get_history(ticker: str):

    stock = yf.Ticker(ticker)

    data = stock.history(period="3mo")

    if data.empty:
        return {"error": "No data found"}

    return {
        "ticker": ticker.upper(),
        "records": data.reset_index().to_dict(orient="records")
    }


################################################################

@app.get("/analytics/{ticker}")
def get_analytics(ticker: str):

    df = get_stock_history(ticker)

    if df.empty:
        return {"error": "No data found"}

    metrics = calculate_stock_metrics(df)
    
    return {
    "ticker": ticker.upper(),
    **metrics
    }



################################################################


@app.get("/compare")
def compare_stocks(tickers: str):
    """
    Compare multiple stocks using key financial metrics.

    Example:
    /compare?tickers=AAPL,MSFT,NVDA
    """

    # Convert "AAPL,MSFT,NVDA" into a Python list
    ticker_list = [ticker.strip().upper() for ticker in tickers.split(",")]

    results = []

    for ticker in ticker_list:

        # Download historical data
        df = get_stock_history(ticker)

        # Skip invalid tickers
        if df.empty:
            continue

        # Calculate analytics using our helper function
        metrics = calculate_stock_metrics(df)

        # Add ticker symbol
        metrics["ticker"] = ticker

        # Save to results list
        results.append(metrics)

    # Sort by best return
    results.sort(
        key=lambda stock: stock["return_pct"],
        reverse=True
    )

    return results

################################################################


@app.get("/correlation")
def correlation(tickers: str):

    ticker_list = [t.strip().upper() for t in tickers.split(",")]

    data = {}

    for ticker in ticker_list:

        df = yf.Ticker(ticker).history(period="6mo")

        if not df.empty:
            data[ticker] = df["Close"]

    corr = pd.DataFrame(data).corr()

    return corr.round(2).to_dict()


################################################################


@app.get("/risk")
def risk_analysis(tickers: str):

    ticker_list = [t.strip().upper() for t in tickers.split(",")]

    results = []

    for ticker in ticker_list:

        df = yf.Ticker(ticker).history(period="6mo")

        if df.empty:
            continue

        volatility = df["Close"].pct_change().std() * 100

        results.append({
            "ticker": ticker,
            "volatility": round(volatility, 2)
        })

    results = sorted(
        results,
        key=lambda x: x["volatility"],
        reverse=True
    )

    return results

################################################################
# Portfolio Risk Analyzer
################################################################

@app.get("/portfolio-analysis")
def portfolio_analysis(
    tickers: str,
    weights: str,
    investment: float = 10000
):

    """
    Analyze portfolio performance and risk.

    Example:

    /portfolio-analysis?
    tickers=AAPL,MSFT,NVDA
    &
    weights=40,30,30

    """

    # Convert input strings into lists

    ticker_list = [
        ticker.strip().upper()
        for ticker in tickers.split(",")
    ]


    weight_list = [
        float(weight.strip()) / 100
        for weight in weights.split(",")
    ]


    results = []


    portfolio_return = 0

    portfolio_volatility = 0


    highest_return = None

    highest_risk = None



    for ticker, weight in zip(
        ticker_list,
        weight_list
    ):


        # Get historical stock data

        df = get_stock_history(
            ticker,
            "6mo"
        )


        if df.empty:
            continue



        # Calculate metrics

        metrics = calculate_stock_metrics(df)



        stock_return = metrics["return_pct"]

        stock_volatility = metrics["volatility_pct"]



        # Weighted return contribution

        portfolio_return += (
            stock_return * weight
        )



        portfolio_volatility += (
            stock_volatility * weight
        )



        results.append({

            "ticker": ticker,

            "weight": weight * 100,

            "return_pct": stock_return,

            "volatility_pct": stock_volatility

        })



    # Find best performing stock

    best_stock = max(
        results,
        key=lambda x:x["return_pct"]
    )


    # Find riskiest stock

    riskiest_stock = max(
        results,
        key=lambda x:x["volatility_pct"]
    )



    # Determine risk level

    if portfolio_volatility < 1.5:

        risk_level = "Low"

    elif portfolio_volatility < 3:

        risk_level = "Medium"

    else:

        risk_level = "High"



    return {

        "investment":
            investment,


        "expected_return_pct":
            round(portfolio_return,2),


        "portfolio_volatility_pct":
            round(portfolio_volatility,2),


        "risk_level":
            risk_level,


        "best_performer":
            best_stock["ticker"],


        "highest_risk":
            riskiest_stock["ticker"],


        "stocks":
            results

    }

#################################################################

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)