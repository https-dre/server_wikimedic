# Http Server to Wikimedic

Servidor Http que servirá a Wikimedic

**Server with MongoDB**


# Rotas

**Usuários**

/users -- get Users 

/users/register -- registrar usuário no banco de dados

/users/login -- autenticar usuário

/users/delete/:id -- deletar usuário

**Medicamentos**

/medicamentos -- get medicamentos

/medicamentos/register -- registrar medicamento no banco de dados

/medicamentos/validate -- validar e registrar medicamento


**Favoritos**

/favoritos -- get favoritos

/favoritos/register -- registrar favorito no banco de dados

/favoritos/getByIdUser/:id -- get favoritos por usuário

/favoritos/delete/:id -- deletar favorito por id

**Comentários**

/comentarios/register -- registrar comentário

/comentarios/numProcesso/:numProcesso -- get comentário por medicamento usando numProcesso

/comentarios/getByIdMed/:id -- get comentário por medicamento usando id do medicamento

/comentarios/delete/:id -- deletar comentário por id