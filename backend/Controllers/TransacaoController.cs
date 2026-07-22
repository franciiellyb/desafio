using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuTodo.Models;
using MeuTodo.Data;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace MeuTodo.Controllers
{
    [ApiController]
    [Route("api/transacoes")]
    public class TransacaoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransacaoController(AppDbContext context)
        {
            _context = context;
        }

        // 1. LISTAGEM (GET: api/transacoes)
        [HttpGet]
        public async Task<IActionResult> ListarTodas()
        {
            var transacoes = await _context.Transacoes.ToListAsync();
            return Ok(transacoes);
        }

        // 2. CRIAÇÃO COM VALIDAÇÃO (POST: api/transacoes)
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CriarTransacaoRequest request)
        {
            // Validação básica de campos
            if (string.IsNullOrWhiteSpace(request.Descricao) || request.Valor <= 0)
                return BadRequest("Dados da transação inválidos.");

            // REGRA 1: O identificador da pessoa informado precisa existir no cadastro
            var pessoa = await _context.Pessoas.FindAsync(request.PessoaId);
            if (pessoa == null)
                return BadRequest("A pessoa informada não existe no cadastro.");

            // REGRA 2: Se a pessoa for menor de idade (menor de 18 anos), apenas despesas poderão ser cadastradas
            if (pessoa.Idade < 18 && request.Tipo == TipoTransacao.Receita)
                return BadRequest("Menores de idade só podem cadastrar transações do tipo Despesa.");

            // Se passou nas validações, cria a transação
            var novaTransacao = new Transacao(
                request.Descricao,
                request.Valor,
                request.Tipo,
                request.PessoaId
            );

            _context.Transacoes.Add(novaTransacao);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ListarTodas), new { id = novaTransacao.Id }, novaTransacao);
        }
    }

    // DTO para receber os dados do React com segurança
    public record CriarTransacaoRequest(string Descricao, decimal Valor, TipoTransacao Tipo, Guid PessoaId);
}