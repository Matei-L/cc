import endpoint_utils
import db


def handle_db_error(e):
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
    else:
        print(e)
