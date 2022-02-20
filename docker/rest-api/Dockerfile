FROM python:3.10.1

EXPOSE 8000

ENV DEBIAN_FRONTEND noninteractive
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y gcc
RUN apt-get install -y g++
RUN apt-get install -y build-essential
RUN apt-get install -y wget

WORKDIR /usr/src/app
COPY ./ ./

RUN pip install -r ./requirements.txt

RUN ["chmod", "+x", "./docker/rest-api/entry.sh"]
ENTRYPOINT ["./docker/rest-api/entry.sh"]
