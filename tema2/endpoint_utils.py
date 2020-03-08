def handle_updated_successfully():
    return 200, "Updated successfully."


def handle_deleted_successfully():
    return 200, "Deleted successfully."


def handle_get_finished_successfully(response):
    return 200, response


def handle_created_successfully():
    return 201, "Created successfully."


def handle_req_body_error():
    return 400, "", "The body is wrongly formatted."


def handle_req_params_null():
    return 400, "", "The params can't be NULL."


def handle_req_type_not_implemented(req_type):
    return 404, "", f"{req_type.name} is not available at this endpoint."


def handle_endpoint_not_found():
    return 404, "", "Endpoint not found."


def handle_resource_not_found():
    return 404, "", "Resource not found."


def handle_database_conflict():
    return 409, "", "The new data creates conflicts!"


def handle_internal_server_error():
    return 500, "", "Internal Server Error."
