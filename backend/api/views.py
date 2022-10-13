from django.utils.translation import gettext as _
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import HelloResponseSerializer, HelloRequestSerializer


@swagger_auto_schema(
    method='get',
    operation_description=_("Returns 'Hello world' response."),
    responses={200: openapi.Response('Greeting', HelloResponseSerializer)}
)
@api_view(['GET'])
def hello_world_view(request):
    greeting = 'Hello world'
    serializer = HelloResponseSerializer({'greeting': greeting})
    return Response(serializer.data, status=200)


@swagger_auto_schema(
    method='post',
    request_body=HelloRequestSerializer,
    operation_description=_("Requires name and returns 'Hello {name}' response."),
    responses={200: openapi.Response('Greeting', HelloResponseSerializer)}
)
@api_view(['POST'])
def hello_name_view(request):
    in_serializer = HelloRequestSerializer(data=request.data)
    in_serializer.is_valid(raise_exception=True)
    greeting = 'Hello ' + in_serializer.validated_data['name']
    out_serializer = HelloResponseSerializer({'greeting': greeting})
    return Response(out_serializer.data, status=200)
