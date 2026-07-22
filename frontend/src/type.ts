export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 0 | 1; // 0 = Receita, 1 = Despesa (Alinhado ao Enum do C#)
  pessoaId: string;
}

// Mapeado de acordo com o PersonTotalDto do C#
export interface ResumoPessoa {
  personId: string;
  name: string;
  totalReceipts: number;
  totalExpenses: number;
  balance: number;
}

// Mapeado de acordo com o TotalsReportResponse do C#
export interface RelatorioGeral {
  people: ResumoPessoa[];
  globalReceipts: number;
  globalExpenses: number;
  globalNetBalance: number;
}