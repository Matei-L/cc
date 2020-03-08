import db
import endpoint_utils


def insert(conn, plant):
    try:
        db.insert(conn, db.PLANTS_TABLE, plant)
    except Exception as e:
        error_type = e.args[0]
        if error_type == db.Errors.MISSING_FIELDS:
            return endpoint_utils.handle_req_body_error()
        elif error_type == db.Errors.CONFLICT:
            return endpoint_utils.handle_database_conflict()
        elif error_type == db.Errors.UNKNOWN:
            print(e.args[1])
            return endpoint_utils.handle_internal_server_error()
    return endpoint_utils.handle_created_successfully()


def update(conn, plant):
    try:
        db.update(conn, db.PLANTS_TABLE, plant)
    except Exception as e:
        error_type = e.args[0]
        if error_type == db.Errors.MISSING_FIELDS:
            return endpoint_utils.handle_req_body_error()
        elif error_type == db.Errors.CONFLICT:
            return endpoint_utils.handle_database_conflict()
        elif error_type == db.Errors.NOT_FOUND:
            return endpoint_utils.handle_resource_not_found()
        elif error_type == db.Errors.UNKNOWN:
            print(e.args[1])
            return endpoint_utils.handle_internal_server_error()
    return endpoint_utils.handle_updated_successfully()


def delete(conn, plant):
    try:
        db.delete(conn, db.PLANTS_TABLE, plant)
    except Exception as e:
        error_type = e.args[0]
        if error_type == db.Errors.MISSING_FIELDS:
            return endpoint_utils.handle_req_body_error()
        elif error_type == db.Errors.CONFLICT:
            return endpoint_utils.handle_database_conflict()
        elif error_type == db.Errors.NOT_FOUND:
            return endpoint_utils.handle_resource_not_found()
        elif error_type == db.Errors.UNKNOWN:
            print(e.args[1])
            return endpoint_utils.handle_internal_server_error()
    return endpoint_utils.handle_deleted_successfully()


def get_all(conn):
    response = []
    try:
        response = db.get_all(conn, db.PLANTS_TABLE)
        for i in range(len(response)):
            response[i]['otherInfo'] = db.get_by_foreign_key(conn, db.OTHER_INFO_TABLE, 'plant_id', response[i]['id'])
    except Exception as e:
        error_type = e.args[0]
        if error_type == db.Errors.MISSING_FIELDS:
            return endpoint_utils.handle_req_body_error()
        elif error_type == db.Errors.CONFLICT:
            return endpoint_utils.handle_database_conflict()
        elif error_type == db.Errors.NOT_FOUND:
            return endpoint_utils.handle_resource_not_found()
        elif error_type == db.Errors.UNKNOWN:
            print(e.args[1])
            return endpoint_utils.handle_internal_server_error()
    return endpoint_utils.handle_get_finished_successfully(response)


def get_by_pk(conn, pk):
    response = []
    try:
        response = db.get_by_primary_key(conn, db.PLANTS_TABLE, pk)
        response['otherInfo'] = db.get_by_foreign_key(conn, db.OTHER_INFO_TABLE, 'plant_id', response['id'])
    except Exception as e:
        error_type = e.args[0]
        if error_type == db.Errors.MISSING_FIELDS:
            return endpoint_utils.handle_req_body_error()
        elif error_type == db.Errors.CONFLICT:
            return endpoint_utils.handle_database_conflict()
        elif error_type == db.Errors.NOT_FOUND:
            return endpoint_utils.handle_resource_not_found()
        elif error_type == db.Errors.UNKNOWN:
            print(e.args[1])
            return endpoint_utils.handle_internal_server_error()
    return endpoint_utils.handle_get_finished_successfully(response)
