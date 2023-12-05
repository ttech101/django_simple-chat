"""
URL configuration for django_chat_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path

from chat.views import chat, imprint, landingPage, login_view, logout_view, register, sphinx_doc, update_messages

urlpatterns = [
    path('', landingPage),
    path('admin/', admin.site.urls),
    path('chat1/', chat),
    path('chat2/', chat),
    path('chat3/', chat),
    path('chat4/', chat),
    path('login/', login_view),
    path('imprint/', imprint),
    path('logout/', logout_view),
    path('register/', register),
    path('doc/', sphinx_doc),
    path('update_messages/', update_messages)
]
