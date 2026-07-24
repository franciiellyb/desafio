 Sistema de Controle de Gastos

 Tecnologias utilizadas:

- **Back-end:** .NET (C#), ASP.NET Core Web API
- **Banco de Dados:** SQLite com Entity Framework Core
- **Front-end:** React com TypeScript
- **Containerização:** Docker & Docker Compose

 📋 Regras de Negócio Implementadas

Cadastro e Gerenciamento de Pessoas:
- Criação, listagem e exclusão de pessoas.
- Identificador único gerado automaticamente (`Guid`).
- **Exclusão em cascata:** Ao deletar uma pessoa, todas as suas transações vinculadas são apagadas automaticamente.

Cadastro e Lançamento de Transações:
- Lançamento de despesas e receitas vinculadas a uma pessoa.
- **Validação de Maioridade:** Pessoas com idade inferior a 18 anos são impedidas de registrar lançamentos do tipo *Receita* (apenas *Despesa* é permitida).
- Validação para garantir que a pessoa selecionada exista no sistema.

**Consulta de Totais e Saldos:**
- Resumo financeiro consolidado em cards (Total de Receitas, Total de Despesas e Saldo Geral).
- Detalhamento por pessoa com saldo individual.

 Os dados são armazenados localmente em um arquivo de banco SQLite (app.db), garantindo a permanência dos cadastros após fechar e reabrir a aplicação

---

 🚀 Como Executar o Projeto

 Opção 1: Utilizando Docker 

Certifique-se de ter o Docker instalado e execute na raiz do projeto:

docker-compose up --build

 Opção 2: Execução Manual

Back-end (.NET)
cd backend
dotnet restore
dotnet run

Front-end (React)
cd frontend
npm install
npm run dev


