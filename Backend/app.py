from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

VC_API_KEY = 'AD7EHNLZ2D3MUGUQ4TVR2E6HG'  # Replace with your actual API key

@app.route('/api/weather', methods=['GET'])
def get_weather():
    location = request.args.get('location')
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if lat and lon:
        query = f"{lat},{lon}"
    elif location:
        query = location
    else:
        return jsonify({'error': 'Missing location or coordinates'}), 400

    url = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{query}?unitGroup=metric&key={VC_API_KEY}&contentType=json&include=alerts"
    response = requests.get(url)
    data = response.json()

    if 'errorCode' in data:
        return jsonify({'error': data.get('message', 'API error')}), 400

    day = data.get('days', [{}])[0]
    
    alerts = data.get('alerts', [])
    alert_text = 'None'
    if alerts:
        alert_text = '; '.join(alert.get('event', '') for alert in alerts)

    weather_info = {
        'location': data.get('resolvedAddress', query),
        'temperature': day.get('temp'),
        'condition': day.get('conditions'),
        'alert': alert_text,
    }
    return jsonify(weather_info)

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    location = request.args.get('location')
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if lat and lon:
        query = f"{lat},{lon}"
    elif location:
        query = location
    else:
        return jsonify({'error': 'Missing location or coordinates'}), 400

    url = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{query}?unitGroup=metric&key={VC_API_KEY}&contentType=json&include=hours"
    response = requests.get(url)
    data = response.json()

    if 'errorCode' in data:
        return jsonify({'error': data.get('message', 'API error')}), 400

    forecast_data = []
    for day in data.get('days', []):
        day_forecast = {
            'date': day.get('datetime'),
            'temperature': day.get('temp'),
            'conditions': day.get('conditions'),
            'hours': day.get('hours', []),
        }
        forecast_data.append(day_forecast)

    return jsonify({'location': data.get('resolvedAddress', query), 'forecast': forecast_data})

if __name__ == '__main__':
    app.run(debug=True)



