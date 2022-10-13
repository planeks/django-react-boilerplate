from django.urls import path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.authtoken import views as drf_views

from . import views

schema_view = get_schema_view(
    openapi.Info(
        title="NEWPROJECTNAME API",
        default_version='v1',
    ),
    public=True,
    permission_classes=[permissions.AllowAny, ],
)

urlpatterns = [
    re_path(r'doc(?P<format>\.json|\.yaml)/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api-token/', drf_views.obtain_auth_token, name='api-token'),
    path('hello-world/', views.hello_world_view, name='hello-world'),
    path('hello-name/', views.hello_name_view, name='hello-name')
]
