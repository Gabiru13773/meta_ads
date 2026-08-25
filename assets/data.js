/* BONATI — Checklist Meta Ads
   Conteúdo do checklist. Editar aqui não exige mexer no layout.
   Campos: t = item · why = justificativa opcional · link = [rótulo, url] opcional
*/

const CHECKLIST = [
  {
    n: 'A',
    title: 'Identidade pessoal',
    lede: 'O perfil pessoal é a base de tudo. Ele deve representar uma pessoa real — nunca um perfil fictício com o nome da agência, nunca uma conta comprada, alugada ou herdada.',
    items: [
      { t: 'Perfil pessoal autêntico, com o nome da pessoa real responsável.' },
      { t: 'E-mail e telefone de recuperação atualizados.' },
      {
        t: 'Autenticação em dois fatores ativada, de preferência por aplicativo autenticador ou chave de segurança.',
        why: 'Guarde os códigos de recuperação em local seguro. Ter mais de um responsável confiável evita ponto único de falha.',
        link: ['Central de Ajuda — 2FA', 'https://www.facebook.com/help/235353253505947']
      },
      { t: 'Alertas de login ativados.' },
      { t: 'Nenhuma senha compartilhada com a equipe.' },
      {
        t: 'Perfil em uso normal, sem "aquecimento" artificial.',
        why: 'Não existe regra oficial exigindo aquecimento de perfil com curtidas, amigos ou padrões específicos de atividade.'
      }
    ]
  },
  {
    n: 'B',
    title: 'Presença da agência',
    lede: 'Página, Instagram, site e empresa precisam contar a mesma história. Incoerência entre esses dados é um dos atritos mais evitáveis em uma revisão manual.',
    items: [
      { t: 'CNPJ e dados jurídicos organizados.' },
      { t: 'Domínio e site próprios funcionando.' },
      { t: 'E-mail profissional no domínio da empresa configurado.' },
      {
        t: 'Página do Facebook criada com o nome comercial verdadeiro da agência.',
        link: ['Blueprint — criar uma Página', 'https://www.facebookblueprint.com/student/activity/409145-how-to-create-a-facebook-page']
      },
      { t: 'Categoria empresarial coerente selecionada.' },
      { t: 'Logo, capa, descrição e informações de contato adicionados à Página.' },
      { t: 'Site oficial adicionado à Página.' },
      { t: 'Instagram criado ou convertido para conta profissional e conectado à Página.' },
      { t: '2FA ativado também no Instagram.' },
      {
        t: 'Experiências conectadas revisadas no Accounts Center.',
        link: ['Meta — Accounts Center', 'https://www.facebook.com/help/943858526073065']
      },
      { t: 'Dados públicos coerentes entre site, Página, Instagram e empresa.' },
      { t: 'Nenhum seguidor, avaliação ou engajamento comprado.' },
      { t: 'Conteúdo real da agência sendo publicado conforme a operação evolui.' }
    ]
  },
  {
    n: 'C',
    title: 'Portfólio Empresarial',
    lede: 'A Meta usa hoje o termo Business Portfolio ou Portfólio Empresarial. Tutoriais e telas antigas ainda falam em Business Manager ou "BM" — é a mesma estrutura.',
    items: [
      {
        t: 'Entrar no Meta Business Suite com o perfil pessoal legítimo.',
        link: ['Abrir o Business Suite', 'https://business.facebook.com/']
      },
      {
        t: 'Portfólio Empresarial da agência criado.',
        link: ['Meta — criar um Portfólio', 'https://www.facebook.com/business/help/1710077379203657']
      },
      { t: 'Nome comercial, dados da empresa, site e contato verdadeiros informados.' },
      { t: 'Página e Instagram da agência adicionados ao Portfólio.' },
      { t: 'Colaboradores cadastrados individualmente, cada um com o próprio perfil.' },
      {
        t: 'Permissões mínimas necessárias definidas por pessoa.',
        why: 'Gestores de tráfego recebem acesso apenas às contas que administram; designers e conteúdo ficam restritos a Página e Instagram.'
      },
      { t: 'Exigência de 2FA ativada para quem tem acesso, quando a opção estiver disponível.' },
      {
        t: 'Número de administradores com controle total limitado.',
        why: 'Mais administradores não é sinônimo de segurança. Quanto mais gente com controle total, maior a superfície de risco. Segurança vem de redundância controlada, permissão mínima e autenticação forte.'
      },
      { t: 'Rotina mensal de auditoria de acessos definida, com revisão imediata quando alguém deixa a equipe.' },
      {
        t: 'Business Support Home conhecido pelos responsáveis.',
        link: ['Business Support Home', 'https://business.facebook.com/business-support-home']
      }
    ]
  },
  {
    n: 'D',
    title: 'Conta de anúncios e pagamento',
    lede: 'A conta de anúncios da agência serve para divulgar a própria agência. Campanha de cliente roda na conta do cliente.',
    items: [
      {
        t: 'Conta de anúncios criada dentro do Portfólio da agência, apenas para publicidade própria.',
        link: ['Ajuda Meta — conta de anúncios', 'https://www.facebook.com/business/help/910137316041095']
      },
      {
        t: 'País, moeda e fuso horário configurados conforme a realidade financeira e operacional.',
        why: 'Para operação brasileira, BRL e horário de São Paulo costumam fazer sentido — desde que correspondam à realidade da empresa.'
      },
      { t: 'Definido quem pode administrar campanhas e quem pode administrar pagamentos.' },
      { t: 'Método de pagamento legítimo e estável, vinculado à operação real da empresa.' },
      { t: 'Sem alterações frequentes e desnecessárias em cartões, responsáveis e configurações financeiras.' },
      {
        t: 'Orçamento inicial economicamente coerente.',
        why: 'Não há regra oficial dizendo que uma conta nova precisa investir um valor específico por um número específico de dias. Evite transformar receita de aquecimento da comunidade em política oficial.'
      }
    ]
  },
  {
    n: 'E',
    title: 'Verificações',
    lede: 'Confirmação de identidade, verificação de anunciante, verificação da empresa, verificação de domínio e Meta Verified são processos diferentes. Um selo pago não blinda a conta nem autoriza anúncio que viole política.',
    items: [
      { t: 'Razão social e nome comercial coerentes entre documentação, site e cadastro na Meta.' },
      { t: 'CNPJ e documentos empresariais atualizados e prontos para eventual verificação.' },
      { t: 'Endereço comercial válido e verificável.' },
      { t: 'Telefone comercial válido.' },
      {
        t: 'Domínio sob controle da empresa, verificado quando for parte relevante da operação.',
        link: ['Meta — verificação de domínio', 'https://www.facebook.com/business/help/286768115176155?id=199156230960298']
      },
      { t: 'Pessoa solicitante realmente autorizada a representar a empresa.' },
      { t: 'Business Verification iniciada apenas quando disponível ou exigida.' },
      {
        t: 'Solicitações de verificação de anunciante atendidas com dados reais.',
        why: 'Em 2026 a Meta anunciou expansão da verificação de anunciantes, reforçando a transparência sobre quem paga pelos anúncios. Os requisitos variam por caso e região.',
        link: ['Meta — verificação de anunciantes', 'https://about.fb.com/br/news/2026/03/combatendo-golpistas-e-protegendo-pessoas-com-novas-tecnologias-e-parcerias/']
      },
      { t: 'Meta Verified tratado como opcional, não como blindagem de anúncios.' }
    ]
  },
  {
    n: 'F',
    title: 'Cada novo cliente',
    lede: 'O cliente continua dono dos ativos do próprio negócio. A agência administra por permissão, não por propriedade — isso reduz risco jurídico, operacional e de ruptura no fim do contrato.',
    items: [
      { t: 'Cliente possui ou cria o próprio Portfólio Empresarial.' },
      { t: 'Cliente confirma que Página, Instagram, conta de anúncios, Pixel/Dataset, catálogo e domínio estão sob a estrutura dele.' },
      { t: '2FA ativado nos responsáveis do lado do cliente.' },
      { t: 'Agência informa o próprio Business ID.' },
      {
        t: 'Cliente adiciona a agência como parceira e compartilha somente os ativos necessários.',
        link: ['Meta — adicionar um parceiro', 'https://www.facebook.com/business/help/1717412048538897']
      },
      { t: 'Agência confirma os acessos sem jamais pedir a senha pessoal do cliente.' },
      {
        t: 'Conta de anúncios e método de pagamento permanecem com o cliente.',
        why: 'Se a agência centraliza os ativos no próprio portfólio, concentra risco financeiro, de acesso e de conformidade — uma restrição na agência atinge vários clientes ao mesmo tempo.'
      },
      { t: 'Acesso concedido apenas aos colaboradores que precisam trabalhar naquela conta.' },
      { t: 'Registro interno de quem tem acesso a quais ativos.' },
      { t: 'Offboarding previsto: ao encerrar, o cliente revoga o acesso sem transferir propriedade.' }
    ]
  },
  {
    n: 'G',
    title: 'Antes do primeiro anúncio',
    lede: 'Revisar mais do que o criativo. A página de destino faz parte do anúncio.',
    items: [
      { t: 'Copy revisada: promessas, linguagem, atributos pessoais, alegações e clareza da oferta.' },
      { t: 'Imagem ou vídeo revisado: conteúdo permitido, coerente com a oferta, sem elementos enganosos.' },
      { t: 'Oferta revisada: produto ou serviço autorizado, representando de verdade o que a pessoa vai receber.' },
      { t: 'Segmentação revisada conforme as restrições de categoria.' },
      { t: 'Landing page funcionando, coerente com o anúncio, sem redirecionamento enganoso nem cloaking.' },
      { t: 'Identidade conferida: marca, empresa e responsável condizentes com os ativos usados.' },
      { t: 'Método de pagamento válido e sem falhas recorrentes.' },
      {
        t: 'Advertising Standards estudadas antes de publicar.',
        link: ['Transparency Center', 'https://transparency.meta.com/policies/ad-standards/']
      },
      {
        t: 'Auditoria de política feita antes de aceitar cliente de segmento sensível.',
        why: 'Finanças, crédito, saúde, medicamentos, apostas, política e produtos regulados têm exigências próprias. Anúncio eleitoral no Brasil exige autorização, transparência e identificação do responsável — não é campanha comercial comum.',
        link: ['Meta — eleições 2026 no Brasil', 'https://about.fb.com/br/news/2026/06/nosso-trabalho-para-as-eleicoes-de-2026-no-brasil/']
      }
    ]
  }
];
