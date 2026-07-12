# Metodologia de Desenvolvimento

O projeto segue **Scrum adaptado** com sprints semanais e alto grau de autonomia dos integrantes.

## Ciclo semanal

- **Sprint semanal**: backlog priorizado com duração de uma semana.
- **Duas reuniões por semana**, registradas seguindo o [template de ata](atas_reuniao/template_ata.md).
- **Retrospectiva**: 15 minutos ao final da sprint (o que funcionou, impedimentos, próximas tarefas).
- **Entrega semanal**: ao fim de cada semana, um integrante consolida a semana no [formulário de entrega](entregas/entrega_semanal/entrega_template.md).

## Fluxo por feature

1. Integrante escolhe ou cria a issue que vai trabalhar na semana.
2. Abre branch a partir de `develop`, seguindo os [padrões de Git](../desenvolvimento/padroes/git.md).
3. Implementa a mudança (pair programming com outro integrante é opcional).
4. Abre PR contra `develop`, usando o [template de PR](../desenvolvimento/padroes/template_PR.md).
5. Outro integrante revisa. Após CI verde e aprovação, o PR é mergeado.
6. Atualiza a documentação da feature na branch `docs` quando pertinente.

`main` recebe merge apenas em pontos de release, através de PR próprio de `develop` para `main`.

## Papéis e responsabilidades

Seis integrantes sem papel fixo por sprint. Cada integrante escolhe as issues que vai executar. A rastreabilidade individual é feita pelo histórico de commits e PRs.

- **Documentador da semana**: responsável pela ata da reunião e por consolidar a entrega semanal.
- **Revisor de PR**: qualquer outro integrante do time.
- **Mantenedor(a)**: quem tem permissão de merge nas branches protegidas (`develop`, `main`, `docs`).

## Dedicação esperada

Dez horas semanais por integrante, incluindo reuniões, implementação, revisão e documentação.
