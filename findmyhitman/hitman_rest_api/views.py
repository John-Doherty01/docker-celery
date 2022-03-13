import json

from rest_framework import permissions, status, serializers
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from hitman_rest_api.tasks import start_new_hit_job
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from dateutil import parser
from django.contrib.auth import get_user_model  # If used custom user model

UserModel = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = UserModel.objects.create_user(
            username=validated_data["username"], password=validated_data["password"],
            first_name=validated_data["first_name"], last_name=validated_data["last_name"],
        )

        return user

    class Meta:
        model = UserModel
        fields = (
            "id",
            "username",
            "password",
            "first_name",
            "last_name"
        )


class StringListField(serializers.ListField):
    day = serializers.CharField(allow_blank=False, min_length=2, max_length=400)


class ScheduleJobSerializer(serializers.Serializer):
    target_name = serializers.CharField(allow_blank=False, min_length=2, max_length=400)
    days_of_week = StringListField()
    schedule_time = serializers.DateTimeField()

    class Meta:
        fields = ("target_name", "schedule_time", "days_of_week")


class HitJobSerializer(serializers.Serializer):
    target_name = serializers.CharField(allow_blank=False, min_length=2, max_length=400)

    class Meta:
        fields = "target_name"


class GetHitmen(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            data={"names": ["bill", "bob", "keanu", "logan"]}, status=status.HTTP_200_OK
        )


class StartNewHitJob(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = HitJobSerializer

    def post(self, request):
        name = request.data.get("target_name")
        new_celery_task = start_new_hit_job.delay(name)
        return Response(
            data={
                "result": f"Job created for {name}",
                "celery_task_id": new_celery_task.id,
            },
            status=status.HTTP_200_OK,
        )


class ScheduleNewHitJob(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ScheduleJobSerializer

    def post(self, request):
        name = request.data.get("target_name")
        schedule_time = parser.parse(request.data.get("schedule_time"))
        schedule, _ = CrontabSchedule.objects.get_or_create(
            day_of_week=",".join(request.data.get("days_of_week")),
            minute=schedule_time.minute,
            hour=schedule_time.hour,
        )

        new_celery_task = PeriodicTask.objects.update_or_create(
            name=f"Schedule hit job for {name}",
            defaults={
                "task": "hitman_rest_api.tasks.start_new_hit_job",
                "args": json.dumps([name]),
                "crontab": schedule,
            },
        )

        return Response(
            data={"result": f"Task scheduled for execution"}, status=status.HTTP_200_OK,
        )


class CreateUserView(CreateAPIView):
    model = get_user_model()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
