import math


def compute_row_metrics(latency, min, max, avg):
    avg += latency
    if latency < min:
        min = latency
    if latency > max:
        max = latency
    return min, max, avg


def get_metrics(batch_size, log_rows):
    metrics_rows = []
    number_of_rows = math.ceil(len(log_rows) / batch_size)
    for p in range(number_of_rows):
        places_min = math.inf
        places_max = 0
        places_avg = 0
        random_min = math.inf
        random_max = 0
        random_avg = 0
        weather_min = math.inf
        weather_max = 0
        weather_avg = 0
        total_min = math.inf
        total_max = 0
        total_avg = 0
        counter = 0
        for i in range(batch_size * p, batch_size * (p + 1)):
            if i < len(log_rows) and log_rows[i][2] != "failed":
                row = log_rows[i]
                counter += 1
                places_latency = float(row[2])
                random_latency = float(row[4])
                weather_latency = float(row[6])
                total_latency = float(row[7])
                places_min, places_max, places_avg = \
                    compute_row_metrics(places_latency, places_min, places_max, places_avg)
                random_min, random_max, random_avg = \
                    compute_row_metrics(random_latency, random_min, random_max, random_avg)
                weather_min, weather_max, weather_avg = \
                    compute_row_metrics(weather_latency, weather_min, weather_max, weather_avg)
                total_min, total_max, total_avg = \
                    compute_row_metrics(total_latency, total_min, total_max, total_avg)
        places_avg = places_avg / counter
        random_avg = random_avg / counter
        weather_avg = weather_avg / counter
        total_avg = total_avg / counter
        metrics_rows += [(places_min, places_max, places_avg,
                          random_min, random_max, random_avg,
                          weather_min, weather_max, weather_avg,
                          total_min, total_max, total_avg)]
    return metrics_rows
