from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Scheme
 
class UserSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')
 
class SchemeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(many=False)
 
    class Meta:
        model = Scheme
        fields = ('id', 'user', 'date', 'title', 'body')