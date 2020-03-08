import endpoint_utils
import json
from request_type import RequestType
import plants_dao


def plants(db_conn, req_type, params=[], body=None):
    if req_type == RequestType.GET:
        return plants_dao.get_all(db_conn)

    elif req_type == RequestType.POST:
        if body is None:
            return endpoint_utils.handle_req_body_error()
        return plants_dao.insert(db_conn, body)

    elif req_type == RequestType.PUT:
        if body is None:
            return endpoint_utils.handle_req_body_error()
        return plants_dao.update(db_conn, body)

    elif req_type == RequestType.DELETE:
        if body is None:
            return endpoint_utils.handle_req_body_error()
        return plants_dao.delete(db_conn, body)
    return endpoint_utils.handle_req_type_not_implemented(req_type)


def plants_by_id(db_conn, req_type, params=[], body=None):
    if req_type == RequestType.GET:
        if params[0].strip() == '':
            return endpoint_utils.handle_req_params_null()
        return plants_dao.get_by_pk(db_conn, params[0])
    return endpoint_utils.handle_req_type_not_implemented(req_type)
