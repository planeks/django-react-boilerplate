from django.conf import settings
from django.contrib import admin
from django.urls import path, re_path, include

admin.site.site_header = 'NEWPROJECTNAME | Admin console'
# admin.site.enable_nav_sidebar = False

urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),
    path('api/v1/', include('api.urls')),
]


import django.views.static
urlpatterns += [
    re_path(r'media/(?P<path>.*)$',
        django.views.static.serve, {
            'document_root': settings.MEDIA_ROOT,
            'show_indexes': True,
        }),
]


# For debug mode only
if settings.CONFIGURATION == 'dev':
    # Turn on debug toolbar
    import debug_toolbar

    urlpatterns += [
        re_path(r'^__debug__/', include(debug_toolbar.urls)),
    ]
