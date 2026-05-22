import { demoPanchangProvider } from './demo'
import type { PanchangProvider, PanchangRequest } from './types'

export const prokeralaPanchangProvider: PanchangProvider = {
  name: 'prokerala',
  isConfigured: () => Boolean(
    process.env.PROKERALA_CLIENT_ID &&
    process.env.PROKERALA_CLIENT_SECRET
  ),
  async getPanchang(request: PanchangRequest) {
    // TODO: Production launch:
    // 1. Exchange PROKERALA_CLIENT_ID / PROKERALA_CLIENT_SECRET for an access token.
    // 2. Call the Prokerala Panchang endpoint with date, lat, lng and timezone.
    // 3. Normalize the response into PanchangData from ./types.
    // 4. Store/cache by createPanchangCacheKey(request) for date + city + lat + lng.
    //
    // Paid API calls are intentionally not implemented in development.
    return demoPanchangProvider.getPanchang(request)
  },
}
