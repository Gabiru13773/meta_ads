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

## Progresso salvo

O progresso fica no `localStorage` do navegador: é por dispositivo e por navegador, não sincroniza entre pessoas. Para acompanhar equipe, use o botão **Relatório de pendências** — ele gera um texto pronto para enviar.

Para limpar em massa em produção, basta trocar a constante `KEY` em `assets/app.js` (ex.: `..._v2`); todos recomeçam do zero.

## Conteúdo

Baseado no guia interno de Meta Ads para agências, consolidado em 24/08/2026. Material operacional, não garantia de aprovação nem aconselhamento jurídico. Revisar a cada trimestre ou quando a Meta anunciar mudanças em verificação, integridade, pagamentos ou políticas.
