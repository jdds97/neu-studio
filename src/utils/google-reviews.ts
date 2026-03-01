/**
 * Fetch Google reviews via Places API with 24h cache.
 * Requires env vars: GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID
 */

export interface GoogleReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
  profilePhotoUrl?: string;
}

interface PlacesApiResponse {
  result?: {
    reviews?: Array<{
      author_name: string;
      rating: number;
      text: string;
      relative_time_description: string;
      profile_photo_url?: string;
    }>;
    rating?: number;
    user_ratings_total?: number;
  };
  status: string;
}

// In-memory cache for Cloudflare Workers
let cachedReviews: GoogleReview[] | null = null;
let cachedRating: { score: number; total: number } | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function getGoogleReviews(env?: Record<string, string>): Promise<{
  reviews: GoogleReview[];
  rating: { score: number; total: number };
}> {
  const now = Date.now();

  // Return cache if fresh
  if (cachedReviews && cachedRating && now - cacheTimestamp < CACHE_TTL) {
    return { reviews: cachedReviews, rating: cachedRating };
  }

  const apiKey = env?.GOOGLE_PLACES_API_KEY || import.meta.env.GOOGLE_PLACES_API_KEY;
  const placeId = env?.GOOGLE_PLACE_ID || import.meta.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return { reviews: [], rating: { score: 0, total: 0 } };
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&reviews_sort=newest&language=es&key=${apiKey}`;

    const response = await fetch(url);
    const data: PlacesApiResponse = await response.json();

    if (data.status !== 'OK' || !data.result) {
      console.error('Google Places API error:', data.status);
      return { reviews: cachedReviews || [], rating: cachedRating || { score: 0, total: 0 } };
    }

    const allReviews = (data.result.reviews || [])
      .filter((r) => r.rating >= 4) // Solo reseñas positivas (4-5 estrellas)
      .map((r) => ({
        authorName: r.author_name,
        rating: r.rating,
        text: r.text,
        relativeTimeDescription: r.relative_time_description,
        profilePhotoUrl: r.profile_photo_url,
      }));

    const rating = {
      score: data.result.rating || 5,
      total: data.result.user_ratings_total || 0,
    };

    // Update cache
    cachedReviews = allReviews;
    cachedRating = rating;
    cacheTimestamp = now;

    return { reviews: allReviews, rating };
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return { reviews: cachedReviews || [], rating: cachedRating || { score: 0, total: 0 } };
  }
}
