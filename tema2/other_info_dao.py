import db
import endpoint_utils
import dao_utils


def insert(conn, other_info):
    try:
        # check if plant with plant_id exists
        db.get_by_primary_key(conn, db.PLANTS_TABLE, other_info['plant_id'])
        db.insert(conn, db.OTHER_INFO_TABLE, other_info)
    except Exception as e:
        return dao_utils.handle_db_error(e)
    return endpoint_utils.handle_created_successfully()


def update(conn, other_info):
    try:
        db.update(conn, db.OTHER_INFO_TABLE, other_info)
    except Exception as e:
        return dao_utils.handle_db_error(e)
    return endpoint_utils.handle_updated_successfully()


def delete(conn, other_info):
    try:
        db.delete(conn, db.OTHER_INFO_TABLE, other_info)
    except Exception as e:
        return dao_utils.handle_db_error(e)
    return endpoint_utils.handle_deleted_successfully()


def get_all(conn):
    try:
        response = db.get_all(conn, db.OTHER_INFO_TABLE)
    except Exception as e:
        return dao_utils.handle_db_error(e)
    return endpoint_utils.handle_get_finished_successfully(response)


def get_by_pk(conn, pk):
    try:
        response = db.get_by_primary_key(conn, db.OTHER_INFO_TABLE, pk)
    except Exception as e:
        return dao_utils.handle_db_error(e)
    return endpoint_utils.handle_get_finished_successfully(response)


def get_by_fk(conn, fk):
    try:
        # in order to check if the plant exists
        db.get_by_primary_key(conn, db.PLANTS_TABLE, fk)

        response = db.get_by_foreign_key(conn, db.OTHER_INFO_TABLE, 'plant_id', fk)
    except Exception as e:
        return dao_utils.handle_db_error(e)
    return endpoint_utils.handle_get_finished_successfully(response)
