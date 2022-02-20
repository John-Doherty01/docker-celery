import random
from time import sleep

from asgiref.sync import async_to_sync
from celery import shared_task
from channels.layers import get_channel_layer


@shared_task(bind=True)
def start_new_hit_job(self, target_name):
    channel_layer = get_channel_layer()
    task_id = self.request.id
    async_to_sync(channel_layer.group_send)(
        task_id,
        {
            "type": "celery_task_update",
            "message": {"progress": 0.1, "status": "Processing"},
        },
    )
    random_number = random.randint(1, 10)
    sleep(random_number)
    async_to_sync(channel_layer.group_send)(
        task_id,
        {
            "type": "celery_task_update",
            "message": {"progress": 0.2, "status": "Processing"},
        },
    )
    random_number = random.randint(1, 10)
    sleep(random_number)
    async_to_sync(channel_layer.group_send)(
        task_id,
        {
            "type": "celery_task_update",
            "message": {"progress": 0.3, "status": "Processing"},
        },
    )

    random_number = random.randint(1, 10)
    sleep(random_number)
    async_to_sync(channel_layer.group_send)(
        task_id,
        {
            "type": "celery_task_update",
            "message": {"progress": 0.4, "status": "Processing"},
        },
    )

    random_number = random.randint(1, 10)
    sleep(random_number)
    async_to_sync(channel_layer.group_send)(
        task_id,
        {
            "type": "celery_task_update",
            "message": {"progress": 1, "status": "Complete"},
        },
    )
