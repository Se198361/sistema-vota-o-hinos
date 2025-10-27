-- Add campaign_id to votes table for multiple campaigns support
ALTER TABLE public.votes ADD COLUMN campaign_id TEXT NOT NULL DEFAULT 'default';

-- Drop the old unique constraint
ALTER TABLE public.votes DROP CONSTRAINT votes_hymn_id_voter_ip_key;

-- Add new unique constraint for (campaign_id, voter_ip)
-- This ensures one vote per IP per campaign, regardless of hymn
ALTER TABLE public.votes ADD CONSTRAINT votes_campaign_voter_unique UNIQUE(campaign_id, voter_ip);

-- Add index for better performance on campaign queries
CREATE INDEX idx_votes_campaign_id ON public.votes(campaign_id);

-- Update existing votes to use default campaign
UPDATE public.votes SET campaign_id = 'default' WHERE campaign_id IS NULL;