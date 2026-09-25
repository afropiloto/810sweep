import type { Market, User } from '../types';

/** Raw market shape from eight10-api-server /markets */
export type ApiMarket = Record<string, unknown>;

const PLACEHOLDER_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80';

function asString(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  return String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.\-]/g, '');
    const n = Number(cleaned);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function youtubeIdFromDataSource(dataSource: unknown): string | null {
  const raw = asString(dataSource);
  const match = raw.match(/^youtube:video:(.+)$/i);
  return match?.[1] || null;
}

function contentUrls(api: ApiMarket): { contentUrl: string; imageUrl: string; contentType: 'video' | 'image' } {
  const ytId = youtubeIdFromDataSource(api.dataSource);
  const imageUrl =
    asString(api.imageUrl) ||
    (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : PLACEHOLDER_AVATAR);
  if (ytId) {
    return {
      contentUrl: `https://www.youtube.com/watch?v=${ytId}`,
      imageUrl,
      contentType: 'video',
    };
  }
  return {
    contentUrl: imageUrl,
    imageUrl,
    contentType: 'image',
  };
}

function mapStatus(status: unknown, outcome: unknown): Market['status'] {
  const s = asString(status).toUpperCase();
  if (s === 'RESOLVED' || s === 'SETTLED' || outcome != null) return 'resolved';
  return 'active';
}

function mapResolutionOutcome(outcome: unknown): Market['resolutionOutcome'] {
  const o = asString(outcome).toUpperCase();
  if (o === 'YES' || o === 'NO') return o;
  return undefined;
}

function buildUser(partial: {
  id: string;
  username: string;
  avatar?: string;
}): User {
  return {
    id: partial.id,
    username: partial.username || 'unknown',
    avatar: partial.avatar || PLACEHOLDER_AVATAR,
    balance: 0,
  };
}

/**
 * Normalize Cloud Run /markets payloads into the UI Market model.
 * Accepts either `{ markets: [...] }` or a bare Market[] / ApiMarket[].
 */
export function extractApiMarkets(payload: unknown): ApiMarket[] {
  if (Array.isArray(payload)) return payload as ApiMarket[];
  if (payload && typeof payload === 'object') {
    const markets = (payload as { markets?: unknown }).markets;
    if (Array.isArray(markets)) return markets as ApiMarket[];
  }
  return [];
}

export function mapApiMarketToUi(api: ApiMarket): Market | null {
  const id = asString(api.id);
  if (!id) return null;

  const question = asString(api.question) || asString(api.targetPost);
  if (!question) return null;

  const handle = asString(api.creatorHandle) || asString(api.listerUsername) || 'creator';
  const username = handle.replace(/^@/, '') || 'creator';
  const { contentUrl, imageUrl, contentType } = contentUrls(api);

  const yesPrice = asNumber(api.clobYesPrice ?? api.ammYesPrice ?? api.probability, 0.5);
  // probability may be 0–100
  const normalizedYes = yesPrice > 1 ? yesPrice / 100 : yesPrice;
  const noPriceRaw = asNumber(api.clobNoPrice ?? api.ammNoPrice, 1 - normalizedYes);
  const normalizedNo = noPriceRaw > 1 ? noPriceRaw / 100 : noPriceRaw;

  const targetValue = asNumber(
    api.resolutionThreshold ?? api.target,
    asNumber(api.targetValue, 0)
  );
  const currentValue = asNumber(api.latestMetricValue ?? api.currentValue, 0);
  const metricLabel =
    asString(api.metric) ||
    asString(api.resolutionCriteria) ||
    asString(api.socialPlatform) ||
    'Metric';

  const creator = buildUser({
    id: asString(api.contentCreatorAddress) || `creator_${username}`,
    username,
    avatar: asString(api.listerAvatarUrl) || imageUrl,
  });

  const marketCreator = buildUser({
    id: asString(api.marketCreatorAddress) || asString(api.listerAddress) || 'mc_api',
    username: asString(api.listerUsername) || '810_api',
    avatar: asString(api.listerAvatarUrl) || PLACEHOLDER_AVATAR,
  });

  const status = mapStatus(api.status, api.outcome);
  const resolutionOutcome = mapResolutionOutcome(api.outcome);

  return {
    id,
    creator,
    marketCreator,
    contentUrl,
    imageUrl,
    contentType,
    question,
    metricLabel,
    currentValue,
    targetValue,
    endTime: asString(api.endTime || api.deadline) || new Date().toISOString(),
    yesPrice: Math.min(1, Math.max(0, normalizedYes)),
    noPrice: Math.min(1, Math.max(0, normalizedNo)),
    volume: asNumber(api.volume, 0),
    liquidity: asNumber(api.totalLiquidity ?? api.liquidity, 0),
    category: asString(api.category) || asString(api.socialPlatform) || 'General',
    whales: [],
    status,
    resolutionOutcome,
    resolvedAt: api.resolvedAt ? asString(api.resolvedAt) : undefined,
    resolutionSource: asString(api.dataSource) || undefined,
  };
}

export function mapApiMarketsPayload(payload: unknown): Market[] {
  return extractApiMarkets(payload)
    .map(mapApiMarketToUi)
    .filter((m): m is Market => m != null);
}
