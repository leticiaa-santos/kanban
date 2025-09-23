from django.shortcuts import render
from .models import Usuario, Tarefa
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import UsuarioSerializar, TarefaSerializer

# Listar e criar usuario
class UsuarioListCreate(ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializar

# Listar e criar tarefas
class TarefaListCreate(ListCreateAPIView):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer

# Consultar tarefa específica, atualizar e deletar
class TarefaRUD(RetrieveUpdateDestroyAPIView):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer
    lookup_field = 'pk'