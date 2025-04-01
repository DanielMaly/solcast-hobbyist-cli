import type {SolcastResponse} from "./querySolcast";

export function processResponses(responses: SolcastResponse[]) {
  responses.forEach((resp) => {
    console.log('\n\nLogging response...')
    console.log(JSON.stringify(resp))
  })
}
