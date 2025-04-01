export interface SolcastResponse {
  forecasts: {
    pv_estimate: number
    pv_estimate10: number
    pv_estimate90: number
    period_end: string
    period: string
  }[]
}

export async function querySolcast(siteId: string, apiKey: string): Promise<SolcastResponse> {

  const url = `https://api.solcast.com.au/rooftop_sites/${siteId}/forecasts?format=json`

  const result = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  })

  return (await result.json()) as SolcastResponse
}
