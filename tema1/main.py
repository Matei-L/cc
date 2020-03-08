import os
import concurrent.futures
from http.server import BaseHTTPRequestHandler, HTTPServer
import re
import google_places_api_handler, random_api_handler, weather_api_handler
import logger
import metrics
from random import randint

PORT_NUMBER = 80
LOAD_TEST_SIZE = 500  # IT SHOULD BE AT LEAST A MULTIPLE OF 10


def get_random_query(queries):
    return queries[randint(0, len(queries) - 1)]


def get_load_request(queries, load_test_size):
    batch_size = load_test_size / 10
    counter = 0
    log_rows = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=batch_size) as executor:
        future_results = {executor.submit(get_single_request, get_random_query(queries)): _ for _ in
                          range(load_test_size)}
        for completed_future in concurrent.futures.as_completed(future_results):
            log = list(completed_future.result())
            log_rows += [log]
            counter += 1
            print(f"{counter} out of {load_test_size} requests finished")

    logger.log(logger.FILE_NAME, log_rows)


def get_single_request(query):
    try:
        cities, places_resp_time = google_places_api_handler.get(query)
        n = len(cities)
        random, random_resp_time = random_api_handler.get(n)
        weather, weather_resp_time = weather_api_handler.get(cities[random])
        total_resp_time = places_resp_time + random_resp_time + weather_resp_time
        return query, cities, places_resp_time, cities[
            random], random_resp_time, weather, weather_resp_time, total_resp_time
    except Exception as e:
        print("Request failed: " + str(e))
        return query, "failed", "failed", "failed", "failed", "failed", "failed", "failed"


class myHandler(BaseHTTPRequestHandler):

    # Handler for the GET requests
    def do_GET(self):
        query_re = re.compile("query=(.*)")
        logs_table_re = re.compile(b"<!--\\W*logs\\W*-->\\W*<table>\\W*</table>")
        metrics_table_re = re.compile(b"<!--\\W*metrics\\W*-->\\W*<table>\\W*</table>")
        load_test_size_re = re.compile(b"<!--\\W*LOAD_TEST_SIZE\\W*-->")
        log_rows = []
        metrics_rows = []
        if self.path == "/" or self.path == "/index.html":
            self.path = "/index.html"
        elif self.path.startswith("/index.html?"):
            query = query_re.search(self.path).group(1)
            log = list(get_single_request(query))
            log_rows = [log]
            logger.log(logger.FILE_NAME, log_rows)
            self.path = "/index.html"
        elif self.path == "/metrics" or self.path == "/metrics/load_test":
            if self.path == "/metrics/load_test":
                queries = open("random_queries.txt", 'r').read().split(' ')
                get_load_request(queries, LOAD_TEST_SIZE)
            log_rows = logger.read(logger.FILE_NAME)
            metrics_rows = metrics.get_metrics(LOAD_TEST_SIZE, log_rows)
            self.path = "/metrics.html"

        try:
            # Check the file extension required and
            # set the right mime type

            mimetype = 'text/html'

            # Open the static file requested and send it
            f = open(os.curdir + os.sep + self.path, 'rb')
            self.send_response(200)
            self.send_header('Content-type', mimetype)
            self.end_headers()
            html = f.read()
            html = logs_table_re.sub(logger.draw_table(logger.LOG_TABLE_HEADER, log_rows), html)
            html = metrics_table_re.sub(logger.draw_table(logger.METRICS_TABLE_HEADER, metrics_rows), html)
            html = load_test_size_re.sub(str(LOAD_TEST_SIZE).encode('utf-8'), html)
            self.wfile.write(html)
            f.close()
            return

        except IOError:
            self.send_error(404, 'File Not Found: %s' % self.path)


server = None
try:
    # Create a web server and define the handler to manage the
    # incoming request
    server = HTTPServer(('', PORT_NUMBER), myHandler)
    print('Started httpserver on port ', PORT_NUMBER)

    # Wait forever for incoming htto requests
    server.serve_forever()
except KeyboardInterrupt:
    server.socket.close()
