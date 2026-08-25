# Checklist Meta Ads — Bonati

Checklist operacional de implantação de conta Meta Ads para agências. Site estático, sem build, sem dependências.

## Estrutura

```
index.html          página única
assets/theme.css    identidade visual (cores, fontes, forma) — edite aqui para mudar a marca
assets/styles.css   layout e componentes
assets/data.js      conteúdo do checklist (7 fases, 63 itens)
assets/app.js       render, persistência, filtro e relatório
assets/logo.svg     marca provisória — substitua pelo arquivo oficial
vercel.json         cache e cabeçalhos de segurança
```

## Publicar no GitHub

```bash
cd checklist-meta-ads
git init
git add .
git commit -m "Checklist Meta Ads"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/checklist-meta-ads.git
git push -u origin main
```

## Publicar na Vercel

1. Acesse vercel.com e escolha **Add New → Project**.
2. Importe o repositório do GitHub.
3. Em Framework Preset selecione **Other**. Build Command e Output Directory ficam vazios — é um site estático.
4. **Deploy**. Cada `git push` na `main` publica automaticamente.

Para domínio próprio: **Project → Settings → Domains**, adicione o domínio e aponte o DNS conforme as instruções da Vercel.

## Trocar o logo

Substitua `assets/logo.svg` pelo arquivo oficial. Se usar PNG, troque também as duas referências em `index.html`:

```html
<link rel="icon" href="assets/logo.png" type="image/png">
<img src="assets/logo.png" alt="Bonati">
```

Fundo transparente funciona melhor no cabeçalho bordô.

## Ajustar a identidade

Tudo em `assets/theme.css`. Alterar `--wine-700` e `--gold-400` reflete no site inteiro.

## Editar o checklist

Em `assets/data.js`. Cada item aceita:

```js
{
  t: 'Texto do item',
  why: 'Justificativa opcional, exibida no "por quê"',
  link: ['Rótulo do link', 'https://url-oficial']
}
```

Ao adicionar ou remover itens, o contador e o indicador de progresso se ajustam sozinhos.

## Progresso em tempo real (Supabase)

O progresso agora é compartilhado entre todas as pessoas via Supabase Realtime: quando alguém marca ou desmarca um item, todo mundo com a página aberta vê a atualização na hora, sem recarregar.

### Configurar

1. No painel do Supabase, abra **SQL Editor** e rode o script `supabase/schema.sql` deste projeto. Ele cria a tabela `checklist_progress`, as policies de acesso e habilita o Realtime.
2. Confira `assets/config.js`: já está preenchido com a URL do projeto e a chave **anon** (pública). Não é preciso mexer.
3. Publique normalmente (GitHub + Vercel, como abaixo). Pronto — qualquer pessoa que abrir o link já sincroniza com as demais.

### Como funciona

- Cada item marcado vira uma linha na tabela `checklist_progress` (`item_id`, `done_by`, `updated_at`). Desmarcar apaga a linha.
- O app assina mudanças na tabela via `supabase.channel(...).on('postgres_changes', ...)` e repinta a tela quando alguém mexe em qualquer dispositivo.
- O botão **Informar seu nome** grava um nome local (no navegador de cada pessoa) que aparece ao lado do item quando ela o marca — ajuda a saber quem fez o quê. É só um rótulo, não é autenticação.
- Se o Supabase ficar indisponível, o app cai automaticamente para `localStorage` (modo local, por navegador) e avisa no indicador de status.

### Segurança das chaves

- A chave **anon** em `assets/config.js` é pública por natureza — é a mesma chave que o navegador de cada pessoa usa. O controle de acesso real está nas *policies* de RLS do `schema.sql`, que hoje liberam leitura/escrita para qualquer um que tenha essa chave (adequado para uma ferramenta interna sem login). Se quiser restringir por usuário no futuro, adicione Supabase Auth e troque as policies para usar `auth.uid()`.
- **Nunca** coloque a chave `service_role` (nem a chave `secret`) em `assets/config.js` ou em qualquer arquivo que vá para o navegador/GitHub — elas dão acesso total ao banco, ignorando RLS. Como essas chaves foram compartilhadas em texto neste chat, vale considerar gerá-las novamente em **Project Settings → API** no painel do Supabase.

### Relatório de pendências

O botão **Relatório de pendências** continua funcionando igual, agora sempre refletindo o estado mais recente vindo do Supabase.

Para "zerar" tudo em produção, use o botão **Limpar** — ele apaga todas as linhas da tabela para todo mundo.

## Conteúdo

Baseado no guia interno de Meta Ads para agências, consolidado em 24/08/2026. Material operacional, não garantia de aprovação nem aconselhamento jurídico. Revisar a cada trimestre ou quando a Meta anunciar mudanças em verificação, integridade, pagamentos ou políticas.
