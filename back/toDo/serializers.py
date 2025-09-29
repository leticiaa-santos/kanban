from .models import Usuario, Tarefa
from rest_framework import serializers

class UsuarioSerializar(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'


class TarefaSerializer(serializers.ModelSerializer):
    responsavel = serializers.CharField(source="idUsuario.nome", read_only=True)

    class Meta:
        model = Tarefa
        
        fields = ['id', 'descricao', 'nomeSetor', 'prioridade', 'status', 'data_cadastro', 'idUsuario', 'responsavel']
