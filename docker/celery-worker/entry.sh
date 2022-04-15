#!/usr/bin/env bash
set -e

# Run tests
cd ./findmyhitman/
python manage.py migrate
python manage.py collectstatic --clear --noinput

echo "Starting celery worker"
exec celery -A findmyhitman worker --beat -Q celery --loglevel=info --concurrency=1 --max-memory-per-child=25000 --scheduler django_celery_beat.schedulers:DatabaseScheduler
