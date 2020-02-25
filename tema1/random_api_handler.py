import json
from api_handler import get_method

config = json.loads(open('config.json').read())
key = config['random_key']
url = config['random_url']
del config


def get(max):
    global url
    global key
    params = {'format': 'text'}
    final_time, result = get_method(url, params)
    number = len(result.text) % max
    return number, final_time


if __name__ == "__main__":
    print(get(10))
