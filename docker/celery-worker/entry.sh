#!/usr/bin/env bash
set -e

# Run tests
cd ./findmyhitman/
python manage.py migrate
python manage.py collectstatic --clear --noinput

echo "Starting celery worker"
/etc/init.d/celerybeat start
exec watchmedo auto-restart -d /usr/src/app -p '*.py' -- celery -A findmyhitman worker -Q celery --loglevel=info
