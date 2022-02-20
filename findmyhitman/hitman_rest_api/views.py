from rest_framework import permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from hitman_rest_api.tasks import start_new_hit_job


class HitJobSerializer(serializers.Serializer):
    target_name = serializers.CharField(allow_blank=False, min_length=2, max_length=400)

    class Meta:
        fields = "target_name"


class GetHitmen(APIView):
    permission_classes = [permissions.AllowAny]

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
