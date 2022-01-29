#!/usr/bin/env bash
set -e

cd ./findmyhitman/
python manage.py migrate
python manage.py collectstatic --clear --noinput

echo "Starting flower"
exec celery -A findmyhitman flower --address=0.0.0.0 --port=5555
