
export enum UserRole {
  ADMIN = 'ADMIN',
  COLLABORATOR = 'COLLABORATOR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  password?: string;
}

export interface ChecklistItem {
  id: number;
  label: string;
  category: 'Abertura' | 'Fechamento';
}

export interface Submission {
  id: string;
  userId?: string;
  user_id?: string; // vindo do Supabase
  userName: string;
  user_name?: string; // vindo do Supabase
  date: string;
  completedItems: number[];
  completed_items?: number[]; // vindo do Supabase
  isFullComplete: boolean;
  is_full_complete?: boolean; // vindo do Supabase
  notes?: string;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Abertura
  { id: 1, label: '1º Ligar o computador', category: 'Abertura' },
  { id: 2, label: '2º Logar o sistema (Geyfood)', category: 'Abertura' },
  { id: 3, label: '3º Verificar o WhatsApp', category: 'Abertura' },
  { id: 4, label: '4º Verificar bobinas, clipes, grampos, maquinetas', category: 'Abertura' },
  { id: 5, label: '5º Abertura do caixa', category: 'Abertura' },
  { id: 6, label: '6º Buscar o troco no escritório', category: 'Abertura' },
  { id: 7, label: '7º Lançar o troco (verificar se o valor está correto)', category: 'Abertura' },
  { id: 8, label: '8º Lançar no sistema o valor exato', category: 'Abertura' },
  { id: 9, label: '9º Imprimir / solicitar a comanda', category: 'Abertura' },
  { id: 10, label: '10º Perguntar ao cliente a forma de pagamento', category: 'Abertura' },
  { id: 11, label: '11º Finalizar a comanda com a forma de pagamento e o comprovante (cartão / pix); caso seja dinheiro, passar o troco se necessário', category: 'Abertura' },
  { id: 12, label: '12º Liberar diariamente o pagamento da segurança, mediante recibo assinado por ele e pelo encarregado', category: 'Abertura' },
  { id: 13, label: '13º Toda e qualquer retirada de valores do caixa deve ser lançada no sistema como despesa e assinada pelo encarregado', category: 'Abertura' },
  { id: 14, label: '14º Comandas de permutas ou feitas por funcionários como nota devem ser assinadas e enviadas junto ao caixa, assim como todas as notas de saída e entrada de mercadorias', category: 'Abertura' },
  { id: 15, label: '15º Aplicar desconto de 10% para policiais militares e advogados mediante apresentação da carteirinha', category: 'Abertura' },
  
  // Fechamento
  { id: 16, label: '16º Fechamento: separar comandas de débito, crédito, pix, dinheiro, ticket e convênio; imprimir o relatório das maquinetas; somar individualmente cada forma de pagamento e conferir com o total do relatório', category: 'Fechamento' },
  { id: 17, label: '17º Lançar todos os valores no sistema e imprimir o relatório', category: 'Fechamento' },
  { id: 18, label: '18º Colocar comandas, dinheiro, notas e relatórios na bolsa e guardar na gaveta do escritório', category: 'Fechamento' },
  { id: 19, label: '19º Organizar o caixa, colocar as máquinas para carregar, retirar o lixo e desligar os computadores', category: 'Fechamento' },
  { id: 20, label: '20º Responder todas as mensagens e atender todas as ligações durante o expediente', category: 'Fechamento' },
];
