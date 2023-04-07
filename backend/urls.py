from django.urls import path, include
from rest_framework import routers
from django.views.decorators.csrf import csrf_exempt

 
from . import views
 
router = routers.DefaultRouter(trailing_slash=False)
router.register(r'schemes', views.SchemeViewSet)
router.register(r'users', views.UserViewSet)
 
urlpatterns = [
    path(r'api/', include(router.urls)),
    path(r'', views.index, name='index')
]