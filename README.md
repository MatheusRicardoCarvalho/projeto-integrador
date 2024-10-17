# Documentação do Projeto StudentHousing

## Descrição do Projeto

Este projeto é o backend do aplicativo **StudentHousing**, desenvolvido como parte do Projeto Integrador da minha gradução em Sistemas Para Internet. O objetivo do aplicativo é conectar estudantes que buscam moradia com outras pessoas para conviver e partilhar moradia.

## Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

- **Node.js**: Ambiente de execução para JavaScript no lado do servidor.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática, melhorando a manutenção e a escalabilidade do código.
- **Express.js**: Facilita o processo de criação do servidor.
- **Prisma**: ORM (Object-Relational Mapping) que simplifica a interação com o banco de dados.
- **SQLite**: Banco de dados leve, sem complexidade e fácil de usar.
- **bcrypt**: Biblioteca para hashing de senhas, garantindo a segurança dos dados dos usuários.
- **jsonwebtoken**: Biblioteca para geração e verificação de tokens JWT, utilizada para autenticação de usuários.
- **CORS**: Middleware que permite requisições de diferentes origens, facilitando a comunicação entre o frontend e o backend.
- **dayjs**: Biblioteca para manipulação de datas, utilizada para gerenciar informações de data e hora.

## Arquitetura do Projeto

A arquitetura do projeto é baseada em uma estrutura de **MVC (Model-View-Controller)**, onde as responsabilidades são separadas da seguinte forma:

- **Models**: Representam a estrutura dos dados e a lógica de acesso ao banco de dados. No projeto, os modelos são definidos utilizando o Prisma, que gera automaticamente as operações de CRUD (Create, Read, Update, Delete) para as entidades do banco de dados.

- **Controllers**: Contêm a lógica de negócios e manipulam as requisições HTTP. Cada controller é responsável por uma entidade específica, como `UserController`, `LikeController`, `AuthController`, e `TagController`. Eles processam as requisições, interagem com os modelos e retornam as respostas apropriadas.

- **Routes**: Definem as rotas da API, mapeando as URLs para os métodos dos controllers. As rotas são organizadas em um único arquivo (`routes.ts`), facilitando a manutenção e a adição de novas funcionalidades.

- **Middlewares**: Funções que podem ser executadas durante o ciclo de vida de uma requisição. O projeto utiliza middlewares para autenticação e manipulação de erros.

## Passo a Passo para Executar o Projeto Localmente

Para executar o projeto na sua máquina local, siga os passos abaixo:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/MatheusRicardoCarvalho/projeto-integrador.git
   ```

2. **Navegue até o diretório do projeto**:
   ```bash
   cd projeto-integrador
   ```

3. **Instale as dependências**:
   Certifique-se de ter o Node.js instalado. Em seguida, execute:
   ```bash
   npm install
   ```

4. **Configure o ambiente**:
   Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:
   ```plaintext
   DATABASE_URL="file:./dev.db"
   KEY_SECRET_TOKEN="sua_chave_secreta_aqui"
   ```

5. **Execute as migrações do Prisma**:
   Para criar as tabelas no banco de dados, execute:
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Inicie o servidor**:
   Para iniciar o servidor em modo de desenvolvimento, execute:
   ```bash
   npm run dev
   ```

7. **Acesse a API**:
   O servidor estará rodando em `http://localhost:3333`. Você pode usar ferramentas como Postman ou Insomnia para testar as rotas da API.

## Conclusão

O backend do aplicativo StudentHousing foi desenvolvido com foco em escalabilidade, segurança e facilidade de manutenção. A utilização de tecnologias modernas e uma arquitetura bem definida garantem que o projeto possa ser facilmente expandido e adaptado às necessidades futuras.
