using System;

namespace MeuTodo.Models
{
    public enum TipoTransacao
    {
        Receita,
        Despesa
    }

    public class Transacao
    {
        // 1. Identificador único gerado automaticamente
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }
        public Guid PessoaId { get; set; }

        // Construtor
        public Transacao(string descricao, decimal valor, TipoTransacao tipo, Guid pessoaId)
        {
            Descricao = descricao;
            Valor = valor;
            Tipo = tipo;
            PessoaId = pessoaId;
        }
    }
}