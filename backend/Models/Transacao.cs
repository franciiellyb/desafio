using System;

namespace MeuTodo.Models
{
    // Usar um enum para o Tipo ajuda a evitar erros de digitação (ex: "despesaa")
    public enum TipoTransacao
    {
        Receita,
        Despesa
    }

    public class Transacao
    {
        // 1. Identificador único gerado automaticamente
        public Guid Id { get; private set; } = Guid.NewGuid();
        
        // 2. Propriedades em PascalCase (padrão C#)
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        
        // 3. Chave estrangeira combinando com o Guid da Pessoa
        public Guid PessoaId { get; set; }

        // Construtor para garantir a inicialização correta
        public Transacao(string descricao, decimal valor, TipoTransacao tipo, Guid pessoaId)
        {
            Descricao = descricao;
            Valor = valor;
            Tipo = tipo;
            PessoaId = pessoaId;
        }
    }
}