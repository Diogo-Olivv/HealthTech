# Rotatividade de Duplas

## Como funciona

A equipe vai ser dividida em 2 grupos principais:

### Equipe Júnior

| Nome                    |
| ----------------------- |
| Hugo Sousa Rosa         |
| Martin Quadros De Melo  |
| Luiza Carneiro Carvalho |

### Equipe Sênior

| Nome                                |
| ----------------------------------- |
| Diogo Oliveira Ferreira             |
| Lucas De Paula Leal                 |
| Gabriel Robson Nunes Neiva da Silva |

Na fase de **Desenvolvimento** (Semana 8-12) e **Deploy** (Semana 13-14), iremos formar duplas, com um integrante **Sênior** e **Júnior** por dupla, isso vai facilitar algumas dinâmicas de aprendizagem, ao mesmo tempo que da mais liberdade para os Júniors.

A cada 2 semanas os integrantes trocam de dupla dentro do seu respectivo perfil. A rotação é separada por perfil: **Júniors** atuam como FullStack e fazem as suas partes da documentação, com exposição gradual a DevOps, enquanto **Sêniors** circulam entre DevOps & Cloud, Documentação & Logs e Guia Técnico.

### Cronograma de Mudança de Duplas

Aqui está o esquema de rotação completo para os 3 ciclos de desenvolvimento (Semanas 8 a 13).

A lógica aplicada foi manter os Seniores "fixos" em suas duplas/frentes de arquitetura e rotacionar os Juniores a cada ciclo. Assim, ao final do projeto, todos os Juniores terão sido mentorados por todos os Seniores e terão tocado em diferentes partes do código.

#### Ciclo 1 (Semanas 8-9)

| Dupla | Sênior                              | Júnior                  |
| ----- | ----------------------------------- | ----------------------- |
| **1** | Diogo Oliveira Ferreira             | Hugo Sousa Rosa         |
| **2** | Lucas De Paula Leal                 | Martin Quadros De Melo  |
| **3** | Gabriel Robson Nunes Neiva da Silva | Luiza Carneiro Carvalho |

#### Ciclo 2 (Semanas 10-11)

| Dupla | Sênior                              | Júnior                  |
| ----- | ----------------------------------- | ----------------------- |
| **1** | Diogo Oliveira Ferreira             | Luiza Carneiro Carvalho |
| **2** | Lucas De Paula Leal                 | Hugo Sousa Rosa         |
| **3** | Gabriel Robson Nunes Neiva da Silva | Martin Quadros De Melo  |

#### Ciclo 3 (Semanas 12-13)

| Dupla | Sênior                              | Júnior                  |
| ----- | ----------------------------------- | ----------------------- |
| **1** | Diogo Oliveira Ferreira             | Martin Quadros De Melo  |
| **2** | Lucas De Paula Leal                 | Luiza Carneiro Carvalho |
| **3** | Gabriel Robson Nunes Neiva da Silva | Hugo Sousa Rosa         |

---

## Definição de Papéis

### Papel Dos Júniors - FullStack

**1. Backend**
Responsável pela codificação do servidor e regras de negócio. Cria as rotas da API, implementa autenticação (JWT/sessões), gerencia a comunicação com o banco de dados, garante o isolamento de dados por usuário e escreve testes unitários.

**2. Frontend**
Desenvolve a interface do usuário, constrói componentes visuais a partir da documentação e integra corretamente os endpoints do Backend, tratando erros e estados de carregamento.

> A partir do Ciclo 3, o Júnior designado como apoio pode participar de tarefas de DevOps ou Documentação sob supervisão direta do Sênior responsável.

---

### Papéis dos Sêniors

**1. FullStack**
Atua como desenvolvedor em tarefas mais críticas, auxiliando o fluxo de desenvolvimento dos Júniors e mantendo a prática em projetos reais.

**2. DevOps & Cloud**
Configura e gerencia a infraestrutura no Google Cloud (Cloud Run / App Engine / Cloud SQL). Mantém as esteiras de CI/CD (GitHub Actions), gerencia variáveis de ambiente, secrets e garante que o deploy reflita fielmente o ambiente de desenvolvimento.

**3. Documentação & Logs**
Responsabilidade dupla: implementa a arquitetura de logs de auditoria do sistema (Login, Logout, Upload, Download, Exclusão e tentativas inválidas) e mantém o MkDocs atualizado, facilitando o fluxo de reuniões e registros da equipe.

**4. Guia Técnico**
Atua como mentor ativo dos Júniors no ciclo. Participa de pair programming, realiza code reviews detalhados, apoia nas decisões arquiteturais de Backend e Frontend, e soluciona impedimentos técnicos. Ao final do ciclo, avalia o Relatório STAR do Júnior acompanhado.

---

## Justificativa

A fase prática tem duração de 2 meses, possibilitando uma dinâmica em grupo. O modelo diferenciado por perfil garante que os Júniors acumulem experiência em programação enquanto os Sêniors desenvolvem visão de infraestrutura, governança e liderança técnica. A figura do Guia Técnico assegura que nenhum Júnior fique impedido sem suporte direto durante o ciclo.
