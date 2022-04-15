#!/usr/bin/env bash
set -e

# Run tests
cd ./findmyhitman/
python manage.py migrate
python manage.py collectstatic --clear --noinput

echo "Starting celery worker"
/etc/init.d/celerybeat start
exec celery -A findmyhitman worker -Q celery --loglevel=info --concurrency=1 --max-memory-per-child=25000
