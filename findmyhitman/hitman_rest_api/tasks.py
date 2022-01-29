from time import sleep

from celery import shared_task


@shared_task
def start_new_hit_job(target_name):
    sleep(10)
    print(f"target sorted {target_name}")
