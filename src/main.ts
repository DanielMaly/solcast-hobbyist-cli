import * as commander from 'commander'
import { name, version } from '../package.json'
import type { SolcastResponse} from "./querySolcast";
import {querySolcast} from "./querySolcast";
import {processResponses} from "./process";

const program = new commander.Command()

program.name(name)
program.version(version)

program.argument('Site id 1', 'The first site id')
program.argument('[Site id 2]', 'The second site id')

program.option('--mocks <path>', 'Use mock files from this directory instead of the API')

program.action(async (siteId1, siteId2) => {
  console.log('Welcome to Solcast Hobbyist CLI')
  console.log(`Version ${version}`)

  const options = program.opts()

  if(options.mocks) {
    console.log(`Will use mocks from ${options.mocks}`)
  }
  else {
    console.log(`Querying Solcast API for site ${siteId1}`)

    const API_KEY = process.env.SOLCAST_API_KEY
    if (!API_KEY) {
      throw new Error('SOLCAST_API_KEY not found in environment variables.')
    }

    const responses: SolcastResponse[] = []
    responses.push(await querySolcast(siteId1, API_KEY))

    if(siteId2) {
      responses.push(await querySolcast(siteId2, API_KEY))
    }

    processResponses(responses)

    console.log('Exiting because the lazy bastard who wrote me went to bed.')
  }
})

program.parse()
