# Backlog de Gerenciamento de Arquivo

## Épico 1: Upload de Arquivos

**US 1.1 MUDAR NOME**

- **Descrição:** Médico quer enviar arquivo de resultado de exame de um paciente para deixar disponível na plataforma para o paciente.

    <!-- - Configurar endpoint da API para receber o arquivo;
    - Interface para upload;
    - Limite de tamanho e formato de arquivo; -->

- **Critérios de Aceitação:**

    - Somente o Médico pode fazer upload de arquivos na plataforma.
    - O arquivo ser um dos formatos aceitos: **A DEFINIR: sugestão: .pdf, .jpg, .jpeg, .png**.
    - Tamanho do arquivo não ser maior que **A DEFINIR: sugestão 10 MB**.
    - O sistema deve renomear internamente o arquivo no momento do upload, garantindo que ele seja único no storage.

## Épico 2: Listar Arquivos
**US 2.1 TROCAR AQUI**

- **Descrição:** Paciente quer acessar os arquivos vinculados a ele para ter ciência dos resultados de seus exames.

- **Critérios de Aceitação:**
    - SDF

**US 2.2 TROCAR AQUI**

- **Descrição:** Médico quer visualizar os arquivos de cada paciente que tem vinculo com ele para saber os exames de todos os seus pacientes.

- **Critérios de Aceitação:**
    - O Paciente terá acesso apenas a lista de arquivos vinculados a ele mesmo.
    - O Médico terá acesso apenas acesso a lista de arquivos dos pacientes vinculados a ele.
    - A listagem deve mostrar: Nome original do arquivo, Data de Upload e Quem enviou.

<!-- - Buscar arquivos do Google Cloud Storage
- Interface da lista de arquivos subidos -->

## Épico 3: Download de Arquivos

**US 3.1 TROCAR AQUI**

- **Descrição:** Paciente quer baixar seu exame para ter disponibilidade localmente.

- **Critérios de Aceitação:**
    - GFDS

**US 3.2 TROCAR AQUI**

- **Descrição:** Médico quer baixar um exame de seu paciente para ter acesso localmente.

- **Critérios de Aceitação:**
    - Um usuário (seja médico ou paciente) não pode baixar um arquivo que não esteja explicitamente vinculado a ele.


<!-- - Download do arquivo
- Botão de Download na listagem  -->

## Épico 4: Exclusão de Arquivos

**US 4.1 TROCAR AQUI**

- **Descrição:** Médico quer excluir um arquivo de um paciente para apagar o exame que foi enviado para o paciente errado.

- **Critérios de Aceitação:**
    - Somente o médico pode excluir arquivos de seus pacientes da plataforma. !!!!!!!!!!!!!!!!!!

<!-- - Deletar arquivo do Google Cloud; !!!!!!!!!!!!!!!!!!
- Interface de Exclusão de arquivo com confirmação do usuário; !!!!!!!!!!!!!!!!!! -->

