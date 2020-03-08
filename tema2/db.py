import sqlite3
from enum import Enum


class Errors(Enum):
    MISSING_FIELDS = 1
    CONFLICT = 2
    UNKNOWN = 3
    NOT_FOUND = 4


PLANTS_TABLE = 'plants'
OTHER_INFO_TABLE = 'other_info'


def open_db():
    conn = sqlite3.connect('h2.db')
    init_db(conn)
    return conn


def close_db(conn):
    conn.close()


def create_table(conn, create_table_sql):
    cursor = None
    try:
        cursor = conn.cursor()
        cursor = conn.cursor()
        cursor.execute(create_table_sql)
        cursor.close()
    except Exception as e:
        if cursor:
            cursor.close()
        raise Exception(Errors.UNKNOWN, str(e))


def init_db(conn):
    create_table(conn, """
        CREATE TABLE IF NOT EXISTS """ + PLANTS_TABLE + """ (
            id integer PRIMARY KEY,
            ipen text NOT NULL,
            popularName text,
            scientificName text NOT NULL,
            author text,
            origin text,
            naturalArea text); """)
    create_table(conn, """
        CREATE TABLE IF NOT EXISTS """ + OTHER_INFO_TABLE + """ (
            id integer PRIMARY KEY,
            plant_id integer NOT NULL,
            title text,
            description text,
            FOREIGN KEY (plant_id) REFERENCES """ + PLANTS_TABLE + """(id)); """)


def get_table_columns(conn, table):
    cursor = None
    try:
        cursor = conn.execute(f'select * from {table};')
        columns = [description[0] for description in cursor.description]
        cursor.close()
    except Exception as e:
        if cursor:
            cursor.close()
        raise Exception(Errors.UNKNOWN, str(e))
    return columns


def get_rowcount(conn, table):
    cursor = None
    try:
        cursor = conn.execute(f'select * from {table};')
        rowcount = len(cursor.fetchall())
        cursor.close()
    except Exception as e:
        if cursor:
            cursor.close()
        raise Exception(Errors.UNKNOWN, str(e))
    return rowcount


def insert(conn, table, item):
    columns = get_table_columns(conn, table)
    for col in columns:
        if col != 'id':
            if col not in item.keys():
                raise Exception(Errors.MISSING_FIELDS)

    item['id'] = get_rowcount(conn, table) + 1

    query = 'INSERT INTO ' + table + ' ('
    query += ','.join(columns)
    query += ') VALUES ('
    num_of_columns = len(columns)
    fields = []
    for index, field in enumerate(columns):
        fields.append(item[field])
        query += '?'
        if index != num_of_columns - 1:
            query += ', '
    query += ')'

    cursor = None
    try:
        cursor = conn.cursor()
        cursor.execute(query, fields)
        conn.commit()
        cursor.close()
    except sqlite3.IntegrityError:
        if cursor:
            cursor.close()
        raise Exception(Errors.CONFLICT)
    except Exception as e:
        if cursor:
            cursor.close()
        if e.args[0] != Errors.CONFLICT:
            raise Exception(Errors.UNKNOWN, str(e))
        else:
            raise Exception(Errors.CONFLICT)


def update(conn, table, item):
    columns = get_table_columns(conn, table)
    for col in columns:
        if col != 'id':
            if col not in item.keys():
                raise Exception(Errors.MISSING_FIELDS)

    # check for <<not found>>
    get_by_primary_key(conn, table, item['id'])

    values = [key + "='" + value + "'" for key, value in item.items() if key != 'id']
    query = 'UPDATE ' + table + ' SET ' + ','.join(values) + "WHERE id=?"

    cursor = None
    try:
        cursor = conn.cursor()
        cursor.execute(query, (item['id'],))
        conn.commit()
        cursor.close()
    except sqlite3.IntegrityError:
        if cursor:
            cursor.close()
        raise Exception(Errors.CONFLICT)
    except Exception as e:
        if cursor:
            cursor.close()
        if e.args[0] != Errors.CONFLICT:
            raise Exception(Errors.UNKNOWN, str(e))
        else:
            raise Exception(Errors.CONFLICT)


def delete(conn, table, item):
    if 'id' not in item.keys():
        raise Exception(Errors.MISSING_FIELDS)

    # check for <<not found>>
    get_by_primary_key(conn, table, item['id'])

    query = 'DELETE FROM ' + table + ' WHERE ID = ?'

    cursor = None
    try:
        cursor = conn.cursor()
        cursor.execute(query, (item['id'],))
        conn.commit()
        cursor.close()
    except sqlite3.IntegrityError:
        if cursor:
            cursor.close()
        raise Exception(Errors.CONFLICT)
    except Exception as e:
        if cursor:
            cursor.close()
        if e.args[0] != Errors.CONFLICT:
            raise Exception(Errors.UNKNOWN, str(e))
        else:
            raise Exception(Errors.CONFLICT)


def get_by_primary_key(conn, table, pk):
    columns = get_table_columns(conn, table)

    query = 'SELECT * FROM ' + table + ' WHERE id = ?'
    cursor = None
    try:
        cursor = conn.cursor()
        cursor.execute(query, (pk,))
        results = cursor.fetchall()
        if len(results) == 0:
            raise Exception(Errors.NOT_FOUND)
    except Exception as e:
        if cursor:
            cursor.close()
        if e.args[0] != Errors.NOT_FOUND:
            raise Exception(Errors.UNKNOWN, str(e))
        else:
            raise Exception(Errors.NOT_FOUND)

    for i in range(len(results)):
        dict_result = dict()
        for key, value in zip(columns, results[i]):
            dict_result[key] = value
        results[i] = dict_result

    if len(results) == 1:
        return results[0]
    else:
        return results


def get_by_foreign_key(conn, table, fk_name, fk):
    columns = get_table_columns(conn, table)

    query = 'SELECT * FROM ' + table + f' WHERE {fk_name} = ?'
    cursor = None
    try:
        cursor = conn.cursor()
        cursor.execute(query, (fk,))
        results = cursor.fetchall()
    except Exception as e:
        if cursor:
            cursor.close()
        raise Exception(Errors.UNKNOWN, str(e))

    for i in range(len(results)):
        dict_result = dict()
        for key, value in zip(columns, results[i]):
            dict_result[key] = value
        results[i] = dict_result

    if len(results) == 1:
        return results[0]
    else:
        return results


def get_all(conn, table):
    columns = get_table_columns(conn, table)

    query = 'SELECT * FROM ' + table
    cursor = None
    try:
        cursor = conn.cursor()
        cursor.execute(query)
        results = cursor.fetchall()
    except Exception as e:
        if cursor:
            cursor.close()
        raise Exception(Errors.UNKNOWN, str(e))

    for i in range(len(results)):
        dict_result = dict()
        for key, value in zip(columns, results[i]):
            dict_result[key] = value
        results[i] = dict_result

    return results
