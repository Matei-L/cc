import time
import requests


def get_method(url, params):
    start_time = time.time()
    result = requests.get(url, params, timeout=10)
    final_time = time.time() - start_time
    return final_time, result


def post_method(url, params):
    start_time = time.time()
    result = requests.post(url, data=params, timeout=10)
    final_time = time.time() - start_time
    return final_time, result
