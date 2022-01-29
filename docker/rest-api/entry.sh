#!/usr/bin/env bash
set -e

# Run tests
cd ./findmyhitman/
python manage.py migrate
rm -rf /usr/src/app/logs/
mkdir /usr/src/app/logs/
touch /usr/src/app/logs/gunicorn.log
touch /usr/src/app/logs/access.log

exec python manage.py runserver 0.0.0.0:8000
