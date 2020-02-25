import json
from api_handler import get_method

config = json.loads(open('config.json').read())
key = config['places_key']
url = config['places_url']
del config


def get(query):
    global url
    global key
    params = {
        "input": query,
        "key": key
    }
    final_time, result = get_method(url, params)
    places = json.loads(result.text)["predictions"]
    cities = get_cities(places)
    return cities, final_time


def get_cities(places):
    cities = []
    for place in places:
        terms = place["terms"]
        if len(terms) == 1 or terms[-1]["value"] == 'Singapore':
            city = terms[-1]["value"].replace(" ", "+")
        elif len(terms) == 2:
            city = terms[-2]["value"].replace(" ", "+")
        elif terms[-1]["value"].lower() == "usa" or terms[-1]["value"].lower() == "india":
            city = terms[-3]["value"].replace(" ", "+")
        else:
            city = terms[-2]["value"].replace(" ", "+")
        cities += [city]
    return cities


if __name__ == "__main__":
    print(get("church"))
