import db
import endpoint_utils
import dao_utils


def insert(conn, plant):
    try:
        db.insert(conn, db.PLANTS_TABLE, plant)
    except Exception as e:
        return dao_utils.handle_db_error(e)
    return endpoint_utils.handle_created_successfully()


def update(conn, plant):
    try:
        db.update(conn, db.PLANTS_TABLE, plant)
    except Exception as e:
        return dao_utils.handle_db_error(e)
    return endpoint_utils.handle_updated_successfully()


def delete(conn, plant):
    try:
        db.delete(conn, db.PLANTS_TABLE, plant)
    except Exception as e:
        return dao_utils.handle_db_error(e)
    return endpoint_utils.handle_deleted_successfully()


def get_all(conn):
    try:
        response = db.get_all(conn, db.PLANTS_TABLE)
        for i in range(len(response)):
            response[i]['otherInfo'] = db.get_by_foreign_key(conn, db.OTHER_INFO_TABLE, 'plant_id', response[i]['id'])
    except Exception as e:
        return dao_utils.handle_db_error(e)
    return endpoint_utils.handle_get_finished_successfully(response)


def get_by_pk(conn, pk):
    try:
        response = db.get_by_primary_key(conn, db.PLANTS_TABLE, pk)
        response['otherInfo'] = db.get_by_foreign_key(conn, db.OTHER_INFO_TABLE, 'plant_id', response['id'])
    except Exception as e:
        return dao_utils.handle_db_error(e)
    return endpoint_utils.handle_get_finished_successfully(response)
