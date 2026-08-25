-- ============================================================================
-- BONATI — Checklist Meta Ads
-- Sincronização em tempo real do progresso do checklist via Supabase.
-- Execute este script inteiro no SQL Editor do Supabase (Database > SQL Editor).
-- ============================================================================

-- 1) Tabela de progresso.
--    Só existe uma linha por item marcado como feito (mesma lógica do antigo
--    objeto `done` em localStorage). Desmarcar um item = apagar a linha.
create table if not exists public.checklist_progress (
  item_id     text primary key,        -- ex.: "0-3" (fase 0, item 3), igual ao id usado no app.js
  done_by     text,                    -- nome de quem marcou (opcional, informado no navegador)
  updated_at  timestamptz not null default now()
);

comment on table public.checklist_progress is
  'Progresso compartilhado do Checklist Meta Ads. Uma linha = um item marcado como concluído.';

-- 2) updated_at sempre atualizado automaticamente em upsert/update.
create or replace function public.checklist_progress_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_checklist_progress_updated_at on public.checklist_progress;
create trigger trg_checklist_progress_updated_at
  before insert or update on public.checklist_progress
  for each row execute function public.checklist_progress_set_updated_at();

-- 3) Row Level Security.
--    Este checklist não tem login de usuário — qualquer pessoa com a chave
--    "anon" (a chave pública, usada no navegador) pode ler e escrever.
--    Isso é adequado para uma ferramenta interna de equipe, mas significa que
--    a chave anon efetivamente concede acesso de escrita a essa tabela para
--    quem a possua. Se quiser restringir por login no futuro, troque estas
--    policies por regras baseadas em auth.uid().
alter table public.checklist_progress enable row level security;

drop policy if exists "checklist_progress_select_all" on public.checklist_progress;
create policy "checklist_progress_select_all"
  on public.checklist_progress
  for select
  to anon, authenticated
  using (true);

drop policy if exists "checklist_progress_insert_all" on public.checklist_progress;
create policy "checklist_progress_insert_all"
  on public.checklist_progress
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "checklist_progress_update_all" on public.checklist_progress;
create policy "checklist_progress_update_all"
  on public.checklist_progress
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "checklist_progress_delete_all" on public.checklist_progress;
create policy "checklist_progress_delete_all"
  on public.checklist_progress
  for delete
  to anon, authenticated
  using (true);

-- 4) Habilita a réplica completa (necessária para o Realtime enviar o registro
--    antigo em eventos de DELETE, já que a chave é o próprio item_id).
alter table public.checklist_progress replica identity full;

-- 5) Adiciona a tabela à publicação usada pelo Supabase Realtime.
--    Se der erro "already a member", pode ignorar — já está habilitada.
alter publication supabase_realtime add table public.checklist_progress;
