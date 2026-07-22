using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeuTodo.Data;
using MeuTodo.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MeuTodo.Controllers
{
    [ApiController]
    [Route("api/totals")] // Endereço da API: http://localhost:PORTA/api/totals
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTotals()
        {
            // 1. Buscamos todas as pessoas e todas as transações do banco
            var people = await _context.Pessoas.ToListAsync();
            var transactions = await _context.Transacoes.ToListAsync();

            var peopleRows = new List<PersonTotalDto>();

            // 2. Calculamos os valores individuais de cada pessoa
            foreach (var person in people)
            {
                // Filtra as transações que pertencem a esta pessoa específica
                var personTransactions = transactions.Where(t => t.PessoaId == person.Id).ToList();

                // Soma as receitas (Tipo == 0 ou TipoTransacao.Receita)
                var totalReceipts = personTransactions
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor);

                // Soma as despesas (Tipo == 1 ou TipoTransacao.Despesa)
                var totalExpenses = personTransactions
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor);

                // Calcula o saldo individual
                var balance = totalReceipts - totalExpenses;

                peopleRows.Add(new PersonTotalDto(
                    person.Id,
                    person.Nome,
                    totalReceipts,
                    totalExpenses,
                    balance
                ));
            }

            // 3. Calculamos o Total Geral somando o resultado de todo mundo
            var globalReceipts = peopleRows.Sum(p => p.TotalReceipts);
            var globalExpenses = peopleRows.Sum(p => p.TotalExpenses);
            var globalNetBalance = globalReceipts - globalExpenses;

            // 4. Montamos a resposta final combinando a lista e os totais gerais
            var response = new TotalsReportResponse(
                peopleRows,
                globalReceipts,
                globalExpenses,
                globalNetBalance
            );

            return Ok(response);
        }
    }

    // DTOs: Objetos auxiliares criados apenas para estruturar o JSON de resposta de forma limpa
    public record PersonTotalDto(Guid PersonId, string Name, decimal TotalReceipts, decimal TotalExpenses, decimal Balance);
    public record TotalsReportResponse(List<PersonTotalDto> People, decimal GlobalReceipts, decimal GlobalExpenses, decimal GlobalNetBalance);
}