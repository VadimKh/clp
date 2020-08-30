import {Command, flags} from '@oclif/command'
import {getApiKey, setApiKey} from '../conf'
import * as inquirer from 'inquirer'

export default class Init extends Command {
  static description = 'Initial set up of clickup cli'

  static examples = [
    '$ clp init',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
  }

  async run() {
    this.parse(Init)
    const apiKey = getApiKey()
    if (apiKey) {
      const result = await inquirer.prompt([{
        type: 'confirm',
        message: 'Key is already defined. Are you sure you want to overwrite it?',
        name: 'confirm',
        default: true,
      }])

      if (!result.confirm) {
        return
      }
    }

    const key = await inquirer.prompt([{
      type: 'password',
      message: 'Enter Api Key: ',
      name: 'apiKey',
    }])

    setApiKey(key)
  }
}
