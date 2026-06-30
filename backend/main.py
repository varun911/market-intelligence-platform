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


@app.get("/")
def home():
    return {"message": "Market Intelligence API running"}


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

    stock = yf.Ticker(ticker)

    df = stock.history(period="3mo")

    if df.empty:
        return {"error": "No data found"}

    returns = (
        (df["Close"].iloc[-1] - df["Close"].iloc[0])
        / df["Close"].iloc[0]
    ) * 100

    volatility = df["Close"].pct_change().std() * 100

    ma_7 = df["Close"].tail(7).mean()

    ma_30 = df["Close"].tail(30).mean()

    return {
        "ticker": ticker.upper(),
        "return_pct": round(returns, 2),
        "volatility_pct": round(volatility, 2),
        "ma_7": round(ma_7, 2),
        "ma_30": round(ma_30, 2)
    }



################################################################


@app.get("/compare")
def compare_stocks(tickers: str):

    ticker_list = [t.strip().upper() for t in tickers.split(",")]

    results = []

    for ticker in ticker_list:

        stock = yf.Ticker(ticker)
        df = stock.history(period="3mo")

        if df.empty:
            continue

        returns = (
            (df["Close"].iloc[-1] - df["Close"].iloc[0])
            / df["Close"].iloc[0]
        ) * 100

        results.append({
            "ticker": ticker,
            "return_pct": round(returns, 2)
        })

    results = sorted(
        results,
        key=lambda x: x["return_pct"],
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

#################################################################

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)