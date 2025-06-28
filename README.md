# Restaurant Popularity Predictor

A lightweight, interactive web app that predicts and ranks restaurant popularity based on customer ratings, review counts, and price levels.

## Prediction Formula
```js
popularity = (rating * 25) + (reviews * 0.3) + (price_level * -10)