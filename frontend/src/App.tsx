import React, { useState, useEffect } from 'react';
import { Pessoa, Transacao, RelatorioGeral } from './type';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [relatorio, setRelatorio] = useState<RelatorioGeral | null>(null);

  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<0 | 1>(1); // Default: 1 = Despesa
  const [pessoaSelecionada, setPessoaSelecionada] = useState('');

  // Mensagens de sucesso de cadastro
  const [msgPessoa, setMsgPessoa] = useState(false);
  const [msgTransacao, setMsgTransacao] = useState(false);

  const carregarDados = async () => {
    try {
      const resPessoas = await fetch(`${API_URL}/pessoas`);
      if (resPessoas.ok) setPessoas(await resPessoas.json());

      const resTransacoes = await fetch(`${API_URL}/transacoes`);
      if (resTransacoes.ok) setTransacoes(await resTransacoes.json());

      const resRelatorio = await fetch(`${API_URL}/totals`);
      if (resRelatorio.ok) setRelatorio(await resRelatorio.json());
    } catch (err) {
      console.error("Erro ao buscar dados do servidor:", err);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCadastrarPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !idade) return;

    const res = await fetch(`${API_URL}/pessoas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, idade: parseInt(idade) })
    });

    if (res.ok) {
      setNome('');
      setIdade('');
      setMsgPessoa(true);
      setTimeout(() => setMsgPessoa(false), 3000);
      carregarDados();
    }
  };

  const handleDeletarPessoa = async (id: string) => {
    if (confirm("Tem certeza? Todas as transações desta pessoa também serão deletadas!")) {
      await fetch(`${API_URL}/pessoas/${id}`, { method: 'DELETE' });
      carregarDados();
    }
  };

  const handleCadastrarTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valor || !pessoaSelecionada) return;

    const response = await fetch(`${API_URL}/transacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        descricao,
        valor: parseFloat(valor),
        tipo: Number(tipo),
        pessoaId: pessoaSelecionada
      })
    });

    if (!response.ok) {
      const erroTexto = await response.text();
      alert(`Erro: ${erroTexto}`);
    } else {
      setDescricao('');
      setValor('');
      setMsgTransacao(true);
      setTimeout(() => setMsgTransacao(false), 3000);
      carregarDados();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', background: '#f8fafc', color: '#1e293b', minHeight: '100vh' }}>
      
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Controle de Gastos</h1>

      
      {/* CARDS DE RESUMO */}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Receitas</span>
          <h3 style={{ color: '#16a34a', fontSize: '1.5rem', marginTop: '0.5rem', margin: '0' }}>
            R$ {relatorio?.globalReceipts.toFixed(2) ?? '0.00'}
          </h3>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Despesas</span>
          <h3 style={{ color: '#dc2626', fontSize: '1.5rem', marginTop: '0.5rem', margin: '0' }}>
            R$ {relatorio?.globalExpenses.toFixed(2) ?? '0.00'}
          </h3>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Saldo Geral</span>
          <h3 style={{ color: (relatorio?.globalNetBalance ?? 0) >= 0 ? '#2563eb' : '#ea580c', fontSize: '1.5rem', marginTop: '0.5rem', margin: '0' }}>
            R$ {relatorio?.globalNetBalance.toFixed(2) ?? '0.00'}
          </h3>
        </div>
      </div>


      
      {/* CADASTRO E LISTA DE PESSOAS */}
      
      <section style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0 }}>1. Cadastro de Pessoas</h2>
        
        <form onSubmit={handleCadastrarPessoa} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '1rem 0' }}>
          <input type="text" placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', flex: 1, minWidth: '200px' }} />
          <input type="number" placeholder="Idade" value={idade} onChange={e => setIdade(e.target.value)} required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '80px' }} />
          <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Cadastrar</button>
        </form>
        {msgPessoa && <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✅ Cadastro concluído!</span>}

        {/* Lista */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1rem' }}>
          {pessoas.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '8px 12px', borderRadius: '20px' }}>
              <span><strong>{p.nome}</strong> ({p.idade} anos)</span>
              <button onClick={() => handleDeletarPessoa(p.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>✕</button>
            </div>
          ))}
        </div>
      </section>


      
      {/* TRANSAÇÕES COM TABELA */}
     
      <section style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0 }}>2. Cadastro de Transações</h2>
        
        <form onSubmit={handleCadastrarTransacao} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <input type="text" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', flex: 1, minWidth: '150px' }} />
          <input type="number" step="0.01" placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100px' }} />
          
          <select value={tipo} onChange={e => setTipo(Number(e.target.value) as 0 | 1)} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
            <option value={1}>Despesa</option>
            <option value={0}>Receita</option>
          </select>

          <select value={pessoaSelecionada} onChange={e => setPessoaSelecionada(e.target.value)} required style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
            <option value="">Selecione a Pessoa...</option>
            {pessoas.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>

          <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lançar</button>
        </form>
        {msgTransacao && <span style={{ color: '#16a34a', fontWeight: 'bold', display: 'block', marginBottom: '15px' }}>✅ Lançamento concluído!</span>}

        <h3>Histórico Geral</h3>
        {/* Tabela de Transações */}
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Tipo</th>
              <th style={{ padding: '12px' }}>Descrição</th>
              <th style={{ padding: '12px' }}>Pessoa</th>
              <th style={{ padding: '12px' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map(t => {
              const dono = pessoas.find(p => p.id === t.pessoaId)?.nome || "Desconhecido";
              const isReceita = t.tipo === 0;
              return (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold',
                      background: isReceita ? '#dcfce7' : '#fee2e2', color: isReceita ? '#15803d' : '#b91c1c'
                    }}>
                      {isReceita ? 'RECEITA' : 'DESPESA'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{t.descricao}</td>
                  <td style={{ padding: '12px' }}>{dono}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: isReceita ? '#16a34a' : '#dc2626' }}>
                    R$ {t.valor.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      
      {/* SEÇÃO 3: TOTAIS   */}
      
      <section style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0 }}>3. Detalhamento por Pessoa</h2>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px' }}>Pessoa</th>
              <th style={{ padding: '12px' }}>Total Receitas</th>
              <th style={{ padding: '12px' }}>Total Despesas</th>
              <th style={{ padding: '12px' }}>Saldo Individual</th>
            </tr>
          </thead>
          <tbody>
            {relatorio?.people.map(r => (
              <tr key={r.personId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}>{r.name}</td>
                <td style={{ padding: '12px', color: '#16a34a' }}>R$ {r.totalReceipts.toFixed(2)}</td>
                <td style={{ padding: '12px', color: '#dc2626' }}>R$ {r.totalExpenses.toFixed(2)}</td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: r.balance >= 0 ? '#2563eb' : '#ea580c' }}>R$ {r.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}