from django.utils.translation import gettext_lazy as _
from rest_framework import serializers


class HelloResponseSerializer(serializers.Serializer):
    greeting = serializers.CharField(label=_('Greeting message'), max_length=50)


class HelloRequestSerializer(serializers.Serializer):
    name = serializers.CharField(label=_('Name'), max_length=25)
