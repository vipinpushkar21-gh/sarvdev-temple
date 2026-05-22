import { createPanchangCacheKey, type PanchangProvider, type PanchangRequest } from './types'

export const demoPanchangProvider: PanchangProvider = {
  name: 'demo',
  isConfigured: () => true,
  async getPanchang(request: PanchangRequest) {
    const cacheKey = createPanchangCacheKey(request)

    return {
      provider: 'demo',
      cacheKey,
      data: {
        date: request.date,
        location: {
          city: request.city,
          lat: request.lat,
          lon: request.lng,
          tz: request.timezone,
        },
        sun: { sunrise: '07:05', sunset: '18:04' },
        moon: { moonrise: '09:41', moonset: '22:31' },
        tithi: 'Shukla Dwitiya',
        nakshatra: 'Shatabhisha',
        yoga: 'Shubha',
        karana: 'Bava',
        rahuKaal: '10:30-12:00',
        abhijitMuhurta: '12:14-12:58',
        source: 'Demo data',
        isDemo: true,
        cacheKey,
      },
    }
  },
}
