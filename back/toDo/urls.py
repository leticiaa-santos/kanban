from django.urls import path
from .views import (UsuarioListCreate, TarefaListCreate, TarefaRUD)

urlpatterns = [

    # Usuário
    path('usuario/', UsuarioListCreate.as_view()),

    # Tarefa
    path('tarefa/', TarefaListCreate.as_view()),
    path('tarefa/<int:pk>/', TarefaRUD.as_view()),
]