-- Ensure campaign_id column exists and set default
ALTER TABLE public.votes ADD COLUMN IF NOT EXISTS campaign_id TEXT;

-- Backfill NULL campaign_id to 'default' for consistency
UPDATE public.votes SET campaign_id = 'default' WHERE campaign_id IS NULL;

-- Drop old unique constraint or index on voter_ip (if any)
DO $$
BEGIN
  -- Try dropping known constraint names safely
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.votes'::regclass AND conname = 'votes_hymn_id_voter_ip_key'
  ) THEN
    ALTER TABLE public.votes DROP CONSTRAINT votes_hymn_id_voter_ip_key;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.votes'::regclass AND conname = 'unique_vote_per_ip'
  ) THEN
    ALTER TABLE public.votes DROP CONSTRAINT unique_vote_per_ip;
  END IF;
END $$;

-- Drop old index if it exists
DROP INDEX IF EXISTS public.unique_vote_per_ip;

-- Create new unique constraint: one vote per IP per campaign
ALTER TABLE public.votes ADD CONSTRAINT unique_vote_per_ip_per_campaign UNIQUE (campaign_id, voter_ip);

-- Helpful index for campaign_id filtering
CREATE INDEX IF NOT EXISTS votes_campaign_id_idx ON public.votes(campaign_id);