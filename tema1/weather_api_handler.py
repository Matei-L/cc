import json
from api_handler import get_method

config = json.loads(open('config.json').read())
key = config['weather_key']
url = config['weather_url']
del config


def get(city):
    global url
    global key
    params = {
        "city": city,
        "key": key
    }
    final_time, result = get_method(url, params)
    if result.text == '':
        weather = "No data available for this city"
    elif result.status_code == 429:
        raise Exception(json.loads(result.text)["status_message"])
    else:
        weather = json.loads(result.text)["data"][0]["weather"]["description"]
    return weather, final_time


if __name__ == "__main__":
    print(get("Iasi"))
