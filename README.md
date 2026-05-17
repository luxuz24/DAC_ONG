Projeto Semestral - DAC
###
Sistema de gestão de ações solidarias(SGAS)
###
Objetivo:
Desenvolver um sistema web que permita a gestão de ações solidárias de uma ONG.
###
StoryTelling:
-  Como voluntario quero poder ver as ações solidarias disponiveis
e me cadastrar para participar delas
-  Como organizador quero poder cadastrar, editar, excluir e ver as ações solidarias
e os voluntários cadastrados nelas
###
Pessoas: 
- Voluntario: Pessoa que se cadastra para participar das ações solidárias
- Organizador: Pessoa que cadastra, edita, exclui e visualiza as ações solidárias e os voluntários cadastrados nelas
###
Requisitos:
-  Cadastro de voluntários
-  Cadastro de organizadores
-  Cadastro de ações solidárias
-  Visualização de ações solidárias
-  Cadastro em ações solidárias
-  Exclusão de cadastro em ações solidárias
-  Visualização de voluntários em ações solidárias
-  Visualização de ações solidárias por voluntário
###
Fluxograma:
-   Usuário
-   Login
-   Menu principal
-   Cadastro de voluntários
-   Cadastro de organizadores
-   Cadastro de ações solidárias
-   Visualização de ações solidárias
-   Cadastro em ações solidárias
-   Exclusão de cadastro em ações solidárias
-   Visualização de voluntários em ações solidárias
-   Visualização de ações solidárias por voluntário
-   Chat entre voluntários e organizadores relacionado a ações solidárias específicas
###
Modelagem:
-   Usuário: nome, email, senha, tipo(voluntário ou organizador)
-   Ação: titulo, descricao, data, local, voluntários cadastrad os
-   Chat: mensagens, voluntário, organizador, ação
###
Tecnologias:
-   Backend: Node.js com Express/ Websocket para Chat em tempo real
-   Frontend: HTML, CSS, JavaScript com React e Tailwind CSS
-   Banco de dados: PostgreSQL
###
Diagrama de classes:
-   Usuário(id, nome, email, senha, tipo(voluntário ou organizador))
-   Ação(id, titulo, descricao, data, local, voluntários cadastrados)
-   Chat(id, mensagem, remetente, destinatário, ação)   
###
Banco de dados:
-   Usuário: nome, email, senha, tipo(voluntário ou organizador)
-   Ação: titulo, descricao, data, local, voluntários cadastrados
-   Chat: mensagens, voluntário, organizador, ação
-   Participação: usuário, ação     
###
Diferencial: No Frontend precisa ter acessibilidade, ou seja, cores que contrastam bem, legendas em tudo que for necessario, etc.
###