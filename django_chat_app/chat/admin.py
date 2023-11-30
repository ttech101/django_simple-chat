from .models import Message
from django.contrib import admin

class MessageAdmin(admin.ModelAdmin):
    fields = ('text','created_at','author','receiver')
    list_display = ('author','text','created_at','receiver')
    search_fields = ('text',)

# Register your models here.
admin.site.register(Message,MessageAdmin)