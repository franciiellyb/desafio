using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuTodo.Models;
using System;
using System.Threading.Tasks;
using MeuTodo.Data;

namespace MeuTodo.Controllers
{
    [ApiController]
    [Route("api/pessoas")] // Isso define que o endereço será: http://localhost:PORTA/api/pessoas
    public class PessoaController : ControllerBase
    {
        private readonly AppDbContext _context;

        // O ASP.NET injeta o seu contexto de banco de dados automaticamente aqui
        public PessoaController(AppDbContext context)
        {
            _context = context;
        }

        // 1. LISTAGEM (GET: api/pessoas)
        [HttpGet]
        public async Task<IActionResult> ListarTodos()
        {
            var pessoas = await _context.Pessoas.ToListAsync();
            return Ok(pessoas);
        }

        // 2. CRIAÇÃO (POST: api/pessoas)
        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] CriarPessoaRequest request)
        {
            // Validações básicas antes de salvar
            if (string.IsNullOrWhiteSpace(request.Nome))
                return BadRequest("O nome é obrigatório.");

            if (request.Idade < 0)
                return BadRequest("A idade não pode ser negativa.");

            var novaPessoa = new Pessoa(request.Nome, request.Idade);
            
            _context.Pessoas.Add(novaPessoa);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(ListarTodos), new { id = novaPessoa.Id }, novaPessoa);
        }

        // 3. DELEÇÃO (DELETE: api/pessoas/{id})
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(Guid id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null) 
                return NotFound("Pessoa não encontrada.");

            // ⚠️ REGRA CRÍTICA: Busca e apaga todas as transações dessa pessoa primeiro
            var transacoesDaPessoa = _context.Transacoes.Where(t => t.PessoaId == id);
            _context.Transacoes.RemoveRange(transacoesDaPessoa);

            // Agora sim, apaga a pessoa com segurança
            _context.Pessoas.Remove(pessoa);
            
            // Salva todas as remoções de uma vez só no banco de dados
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // Um objeto simples (DTO) apenas para receber o JSON que vem do React com segurança
    public record CriarPessoaRequest(string Nome, int Idade);
}