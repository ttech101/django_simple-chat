import os
from django.utils import timezone
from django.http import Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render
from .models import Chat, Message
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core import serializers
from django.core.serializers import serialize
from django.contrib.sessions.models import Session

# Create your views here.

@login_required(login_url='/login/')


def chat(request):
    """
    This view returns the individual chat rooms as well as the new posts if they exist.
    """
    chatId = request.get_full_path()[-2]
    logged_in_users = getCurrentlyLoggedUsers()
    if request.method == 'POST':
        myChat = Chat.objects.get(id=chatId)
        new_message = Message.objects.create(text=request.POST['textmessage'], chat=myChat, author=request.user, receiver=request.user)
        serialized_obj = serializers.serialize('json', [new_message,])
        return JsonResponse(serialized_obj[1:-1], safe=False)
    chatMessages = Message.objects.filter(chat__id=chatId)
    return render(request, 'chat/chat'+chatId+'.html',{'messages': chatMessages,'logged_in_users': logged_in_users})


def login_view(request):
    """
    This view controls the user's login and directs him to room 1 if necessary
    """
    redirect = request.GET.get('next')
    if request.method == 'POST':
        redirect = request.POST.get('redirect')
        user = authenticate(username=request.POST.get('username'), password = request.POST.get('password'))
        if user:
            login(request, user)
            print('->>',redirect)
            if redirect != 'None':
                print('richtig?')
                return HttpResponseRedirect(request.POST.get('redirect'))
            else:
                print('falsch?')
                return HttpResponseRedirect('/chat1/')
        else:
            return render(request, 'auth/login.html',{'wrongPassword': True, 'redirect': redirect}  )
    return render(request, 'auth/login.html', {'redirect': redirect})

def register(request):
    """
    In this view, the registration of the users is processed and, if the registration is successful, they are forwarded to the respective chat room
    """
    redirect = request.GET.get('next')
    print(request.method == 'POST')
    if request.method == 'POST' and request.POST.get('password1') == request.POST.get('password2'):
        user = User.objects.create_user(username=request.POST.get('nickname'),first_name=request.POST.get('first_name'),last_name=request.POST.get('last_name'), email=request.POST.get('email'), password=request.POST.get('password1'))
        print(user)
        if user:
            login(request, user)
            if redirect:
                return HttpResponseRedirect(request.POST.get('redirect'))
            else:
                return HttpResponseRedirect('/chat1/')
    else:
        print('Passwort falsch')
    return  render(request, 'register/register.html')


def update_messages(request):
    """
    This view function updates the new messages in the respective chat rooms
    """
    chatId = viewDetermine(request)
    my_chat = Chat.objects.get(id=chatId)
    messages = Message.objects.filter(chat=my_chat).select_related('author')  # Verwende select_related, um den "author" aufzulösen
    # Extrahiere benutzerdefinierte Daten für die Serialisierung
    serialized_messages = []
    for message in messages:
        serialized_message = {
            'text': message.text,
            'created_at': message.created_at,
            'created_time': message.created_time.strftime("%H:%M"),
            'author': message.author.username
        }
        serialized_messages.append(serialized_message)
    return JsonResponse(serialized_messages, safe=False)

def landingPage(request):
    """
    This view of the landing page returns the logged in users in the menu
    """
    logged_in_users = getCurrentlyLoggedUsers()
    return render(request, 'landing/landingpage.html',{'logged_in_users': logged_in_users})


def logout_view(request):
    """
    This function controls the logout process
    """
    logout(request)
    return render(request, 'landing/landingpage.html')


def getCurrentlyLoggedUsers():
    """
    This function in view returns the current user
    """
    active_sessions = Session.objects.filter(expire_date__gte=timezone.now())
    logged_in_users = []
    for session in active_sessions:
        session_data = session.get_decoded()
        user_id = session_data.get('_auth_user_id')
        if user_id:
            logged_in_user = User.objects.get(id=user_id)
            logged_in_users.append(logged_in_user)
    return (logged_in_users)

def viewDetermine(request):
    """
    This function returns the current chat room
    """
    return request.GET.get('key1')[-2]

def imprint(request):
    """
    This view renders the imprint part
    """
    logged_in_users = getCurrentlyLoggedUsers()
    return render(request, 'imprint/imprint.html',{'logged_in_users': logged_in_users})



def sphinx_doc(request):
    # Passe den Pfad zu deinem Dokumentationsverzeichnis an
    doc_directory = './docs/_build/singlehtml/'

    # Lese den Inhalt der index.html-Datei ein
    with open(os.path.join(doc_directory, 'index.html'), 'r', encoding='utf-8') as f:
        doc_content = f.read()

    # Gib den HTML-Inhalt in der Django-View aus
    return render(request, 'imprint/doc.html', {'doc': doc_content})

