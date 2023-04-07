from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from .models import Scheme
from . import serializers
from .permissions import ReadOnly
 
def index(request, path=''):
    return render(request, 'index.html')

class UserViewSet(viewsets.ModelViewSet):
    """
    Provides basic CRUD functions for the User model
    """
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = (ReadOnly, )
 

class SchemeViewSet(viewsets.ModelViewSet):
    """
    Provides basic CRUD functions for the Scheme model
    """
    queryset = Scheme.objects.all()
    serializer_class = serializers.SchemeSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )
 
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

