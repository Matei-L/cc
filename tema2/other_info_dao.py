import db
import endpoint_utils


def insert(conn, other_info):
    try:
        db.insert(conn, db.OTHER_INFO_TABLE, other_info)
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


def update(conn, other_info):
    try:
        db.update(conn, db.OTHER_INFO_TABLE, other_info)
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


def delete(conn, other_info):
    try:
        db.delete(conn, db.OTHER_INFO_TABLE, other_info)
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
        response = db.get_all(conn, db.OTHER_INFO_TABLE)
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
        response = db.get_by_primary_key(conn, db.OTHER_INFO_TABLE, pk)
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


def get_by_fk(conn, fk):
    response = []
    try:
        # in order to check if the plant exists
        db.get_by_primary_key(conn, db.PLANTS_TABLE, fk)

        response = db.get_by_foreign_key(conn, db.OTHER_INFO_TABLE, 'plant_id', fk)
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
