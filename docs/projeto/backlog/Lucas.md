# Backlog de Gerenciamento de Arquivo
<!-- 
CRUD
UPLOAD DE ARQUIVOS
Listagem de arquivos
Deletar arquivos
Download de arquivos

 -->
## Épico 1: Gerenciamento de Arquivo

**US 1.1 Upload de Arquivos**

- **Descrição:** Como médico, quero enviar arquivo de resultado de exame de um paciente para deixar disponível na plataforma para o paciente e para os outros médicos.

    <!-- - Configurar endpoint da API para receber o arquivo;
    - Interface para upload;
    - Limite de tamanho e formato de arquivo; -->

- **Critérios de Aceitação:**

    - Somente o Médico pode fazer upload de arquivos na plataforma.
    - O arquivo ser um dos formatos aceitos: **A DEFINIR: sugestão: .pdf, .jpg, .jpeg, .png**.
    - Não pode aceitar upload de arquivo maior que **A DEFINIR: sugestão 10 MB**.
    - O sistema deve renomear internamente o arquivo no momento do upload, garantindo que ele seja único no storage.

**US 1.2 Listagem de Arquivos**

- **Descrição:** Como Paciente, quero acessar todos os exames vinculados a ele para poder ler os resultados de seus exames.

- **Critérios de Aceitação:**
    - Somente aparecer na página exames que sejam vinculados a somente aquele paciente.
    - Ser visível o médico que fez upload do exame.
    - Os arquivos devem ser inicialmente ordenados por ordem de publicação mais recente.
    - A listagem deve mostrar: Nome original do arquivo, Data de Upload e Quem enviou.

**US 1.3 Listagem de Arquivos Médico**

- **Descrição:** Como Médico, quero visualizar os arquivos de exames de cada paciente que tem vinculo com ele para saber os exames de todos os seus pacientes.
- **Critérios de Aceitação:**
    - O Médico terá acesso apenas acesso a lista de arquivos dos pacientes vinculados a ele.
    - A listagem deve mostrar: Nome original do arquivo, Data de Upload e Quem enviou.

<!-- - Buscar arquivos do Google Cloud Storage
- Interface da lista de arquivos subidos -->

**US 1.4 Download de Arquivos**

- **Descrição:** Paciente quer baixar seu exame para ter disponibilidade localmente.

- **Critérios de Aceitação:**
    - GFDS

**US 1.5 TROCAR AQUI**

- **Descrição:** Médico quer baixar um exame de seu paciente para ter acesso localmente.

- **Critérios de Aceitação:**
    - Um usuário (seja médico ou paciente) não pode baixar um arquivo que não esteja explicitamente vinculado a ele.


<!-- - Download do arquivo
- Botão de Download na listagem  -->

**US 1.6 Exclusão de Arquivos**

- **Descrição:** Médico quer excluir um arquivo de um paciente para apagar o exame que foi enviado para o paciente errado.

- **Critérios de Aceitação:**
    - Somente o médico pode excluir arquivos de seus pacientes da plataforma. !!!!!!!!!!!!!!!!!!

<!-- - Deletar arquivo do Google Cloud; !!!!!!!!!!!!!!!!!!
- Interface de Exclusão de arquivo com confirmação do usuário; !!!!!!!!!!!!!!!!!! -->

