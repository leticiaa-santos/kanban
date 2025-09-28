from django.db import models

PRIORIDADE_CHOICES = [
    ('baixa', 'baixa'),
    ('media', 'media'),
    ('alta', 'alta')
]

STATUS_CHOICES = [
    ('a fazer', 'a fazer'),
    ('fazendo', 'fazendo'),
    ('feito', 'feito')
]   

class Usuario(models.Model):
    nome = models.CharField(max_length=40)
    email = models.CharField(max_length=40, unique=True)

    def __str__(self):
        return self.nome
    
class Tarefa(models.Model):
    descricao = models.TextField(max_length=255)
    nomeSetor = models.CharField(max_length=90)
    prioridade = models.CharField(max_length=5, choices=PRIORIDADE_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='a fazer')
    data_cadastro = models.DateField(auto_now_add=True)
    idUsuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return f'O usuário {self.idUsuario} tem a tarefa {self.descricao}'

