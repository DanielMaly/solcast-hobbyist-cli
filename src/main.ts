import * as commander from 'commander';
import { name, version } from '../package.json';

const program = new commander.Command();

program.name(name);
program.version(version);

program.parse();

console.log('Welcome to Solcast Hobbyist CLI')
console.log(`Version ${version}`)
