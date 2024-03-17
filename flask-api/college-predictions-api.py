from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load the model
model = joblib.load('linear_regression_model_pipeline.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    df = pd.DataFrame([data])
    prediction = model.predict(df)
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)