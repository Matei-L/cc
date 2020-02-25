import re

FILE_NAME = "logs.txt"
LOG_TABLE_HEADER = b"""
<tr>
    <th>Query</th>
    <th>Cities</th>
    <th>Google Places Latency</th>
    <th>Random City</th>
    <th>Kanye.rest Latency</th>
    <th>Current Weather</th>
    <th>Weatherbit.io Latency</th>
    <th>Total Latency</th>
</tr>
"""
METRICS_TABLE_HEADER = b"""
<tr>
    <th>Google Places Min Latency</th>
    <th>Google Places Max Latency</th>
    <th>Google Places Avg Latency</th>
    <th>Kanye.rest Min Latency</th>
    <th>Kanye.rest Max Latency</th>
    <th>Kanye.rest Avg Latency</th>
    <th>Weatherbit.io Min Latency</th>
    <th>Weatherbit.io Max Latency</th>
    <th>Weatherbit.io Avg Latency</th>
    <th>Total Min Latency</th>
    <th>Total Max Latency</th>
    <th>Total Avg Latency</th>
</tr>
"""


def log(file_name, rows):
    with open(file_name, 'a', encoding='utf-8') as log_file:
        for row in rows:
            line = ""
            for col_index in range(len(row)):
                line += str(row[col_index])
                if col_index != len(row) - 1:
                    line += '|'
            log_file.write(line)
            log_file.write('\n')


def read(file_name):
    rows = []
    with open(file_name, 'r') as log_file:
        lines = log_file.readlines()
        for line in reversed(lines):
            row = line.split('|')
            rows += [row]
    return rows


def draw_table(header, rows):
    float_re = re.compile(r'^-?\d+(?:\.\d+)?$')
    if rows:
        html = b"""<table>
        """
        html += header
        for row in rows:
            html += b"""<tr>
            """
            for col in row:
                el = str(col)
                if float_re.match(el) is not None:  # check if el is a float
                    el = "{:.4f}".format(float(el))
                html += b"""    <th>""" + el.encode('utf-8') + b"""</th>
                """
            html += b"""</tr>
            """
        html += b"""</table>
                """
        return html
    else:
        return b"<table>\n</table>"
