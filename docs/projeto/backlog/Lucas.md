# Backlog de Gerenciamento de Arquivo

## 1. Upload de Arquivos
- Configurar endpoint da API para receber o arquivo;
- Interface para upload;
- Limite de tamanho e formato de arquivo;
### História 1
- Médico quer enviar arquivo de resultado de exame de um paciente para deixar disponível na plataforma para o
#### Critérios
- Somente o Médico pode fazer upload de arquivos na plataforma.
- O arquivo ser um dos formatos aceitos: **A DEFINIR: sugestão: .pdf, .jpg, .jpeg, .png**.
- Tamanho do arquivo não ser maior que **A DEFINIR: sugestão 10 MB**.
- O sistema deve renomear internamente o arquivo no momento do upload, garantindo que ele seja único no storage.

## 2. Listar Arquivos
- Buscar arquivos do Google Cloud Storage
- Interface da lista de arquivos subidos

### História 1
- Paciente quer acessar os arquivos vinculados a ele para ter ciência dos resultados de seus exames.
### História 2
- Médico quer visualizar os arquivos de cada paciente que tem vinculo com ele para saber os exames de todos os seus pacientes.

#### Critérios
- O Paciente terá acesso apenas a lista de arquivos vinculados a ele mesmo.
- O Médico terá acesso apenas acesso a lista de arquivos dos pacientes vinculados a ele.
- A listagem deve mostrar: Nome original do arquivo, Data de Upload e Quem enviou.

## 3. Download de Arquivos
- Download do arquivo
- Botão de Download na listagem 
### História 1
- Paciente quer baixar seu exame para ter disponibilidade localmente.
### História 2
- Médico quer baixar um exame de seu paciente para ter acesso localmente.
#### Critérios
- Um usuário (seja médico ou paciente) não pode baixar um arquivo que não esteja explicitamente vinculado a ele.

## 4. Exclusão de Arquivos
- Deletar arquivo do Google Cloud;
- Interface de Exclusão de arquivo com confirmação do usuário;
### História
- Médico quer excluir um arquivo de um paciente para apagar o exame que foi enviado para o paciente errado.
#### Critério
- Somente o médico pode excluir arquivos de seus pacientes da plataforma.

