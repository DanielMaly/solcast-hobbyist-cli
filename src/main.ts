import * as commander from 'commander';
import { name, version } from '../package.json';

const program = new commander.Command()

program.name(name)
program.version(version)

program.argument('Site id 1', 'The first site id')
program.argument('[Site id 2]', 'The second site id')

program.action(async (siteId1, siteId2) => {
  console.log('Welcome to Solcast Hobbyist CLI')
  console.log(`Version ${version}`)
  console.log('Querying Solcast API...')

  const API_KEY = process.env.SOLCAST_API_KEY
  if(!API_KEY) {
    throw new Error('SOLCAST_API_KEY not found in environment variables.')
  }

  console.log(siteId1)
  console.log(siteId2)


  const url = `https://api.solcast.com.au/rooftop_sites/${siteId1}/forecasts?format=json`

  const result = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`
    }
  })

  console.log(JSON.stringify(await result.json()))

})

program.parse()
