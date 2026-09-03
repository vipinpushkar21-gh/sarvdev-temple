import { PanchangProviderUnavailableError, type PanchangProvider, type PanchangRequest } from './types'

export const prokeralaPanchangProvider: PanchangProvider = {
  name: 'prokerala',
  isConfigured: () => Boolean(
    process.env.PROKERALA_CLIENT_ID &&
    process.env.PROKERALA_CLIENT_SECRET
  ),
  async getPanchang(_request: PanchangRequest, _signal?: AbortSignal) {
    // This adapter is intentionally inactive until authentication and response
    // normalization have been implemented and reviewed. It must never provide
    // substitute data in place of calculated results.
    throw new PanchangProviderUnavailableError(
      'A verified Panchang provider is not enabled for this environment.'
    )
  },
}
