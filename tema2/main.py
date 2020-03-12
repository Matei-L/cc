from http.server import BaseHTTPRequestHandler, HTTPServer
import re
import json
import plants
import other_info
import db
import endpoint_utils
from request_type import RequestType

PORT_NUMBER = 80


class MyHandler(BaseHTTPRequestHandler):
    db_conn = db.open_db()
    endpoints = [
        dict(endpoint=re.compile('/plants/*$'), function=plants.plants),
        dict(endpoint=re.compile("/plants/by_id/(\\d*)$"), function=plants.plants_by_id),
        dict(endpoint=re.compile("/other_info/*$"), function=other_info.other_info),
        dict(endpoint=re.compile("/other_info/by_id/(\\d*)$"), function=other_info.other_info_by_id),
        dict(endpoint=re.compile("/other_info/by_plant_id/(\\d*)$"), function=other_info.other_info_by_plant_id)
    ]

    def send_api_json_response(self, status_code, response, message=None):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        if 200 <= status_code <= 300:
            self.wfile.write(json.dumps(response).encode())
        else:
            self.wfile.write(json.dumps(message).encode())

    def load_body(self):
        body = None
        try:
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length).decode()
            body = json.loads(body)
        except:
            body = None
        finally:
            return body

    def handle_request(self, req_type):
        for endpoint in self.endpoints:
            match_result = endpoint["endpoint"].match(self.path)
            if match_result:
                params = []
                if match_result.lastindex:
                    for i in range(1, match_result.lastindex + 1):
                        params += [match_result.group(i)]
                body = self.load_body()
                return endpoint["function"](self.db_conn, req_type, params, body)

        return endpoint_utils.handle_endpoint_not_found()

    def do_GET(self):
        result = self.handle_request(RequestType.GET)
        self.send_api_json_response(*result)

    def do_POST(self):
        result = self.handle_request(RequestType.POST)
        self.send_api_json_response(*result)

    def do_PUT(self):
        result = self.handle_request(RequestType.PUT)
        self.send_api_json_response(*result)

    def do_DELETE(self):
        result = self.handle_request(RequestType.DELETE)
        self.send_api_json_response(*result)

    # Uncomment and make 2 requests to get 500 on the second request
    # ( the first closes the connection to the database )
    def __del__(self):
        self.db_conn.close()


if __name__ == "__main__":
    server = None
    try:
        # Create a web server and define the handler to manage the
        # incoming request
        server = HTTPServer(('', PORT_NUMBER), MyHandler)
        print('Started httpserver on port ', PORT_NUMBER)

        # Wait forever for incoming http requests
        server.serve_forever()
    except KeyboardInterrupt:
        server.socket.close()
    except:
        MyHandler.db_conn.close()
