import {Command, flags} from '@oclif/command'
import {getApiKey, setApiKey, setDefaultTeam, setDefaultSpace, setDefaultList, getDefaultTeam, getDefaultSpace, getDefaultList} from '../conf'
import {getTeams, getSpaces, getLists, ClickUpList, ClickUpTeam, ClickUpSpace} from '../clickup'
import * as inquirer from 'inquirer'
import cli from 'cli-ux'
import chalk from 'chalk'
import { chooseTeam, chooseSpace, chooseList } from '../utils'

// inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))
// inquirer.registerPrompt('search-list', require('inquirer-search-list'))

export default class Config extends Command {
  static description = 'Initial set up of clickup cli'

  static examples = [
    '$ clp config',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    list: flags.boolean({char: 'l', description: 'Use it to define default list'}),
    space: flags.boolean({char: 's', description: 'Use it to define default space'}),
    team: flags.boolean({char: 't', description: 'Use it to define default team'}),
    display: flags.boolean({char: 'd', description: 'Show current configuration'}),
  }

  async run() {
    const {flags} = this.parse(Config)

    if (flags.display) {
      // eslint-disable-next-line no-console
      console.log(`Api Key is ${getApiKey() ? '' : 'not '} defined`)
      // eslint-disable-next-line no-console
      console.log('Default team: ', chalk.bold(getDefaultTeam().name))
      // eslint-disable-next-line no-console
      console.log('Default space: ', chalk.bold(getDefaultSpace().name))
      // eslint-disable-next-line no-console
      console.log('Default list: ', chalk.bold(getDefaultList().name))
      return
    }

    if (flags.team) {
      setDefaultTeam(await chooseTeam())
    }

    if (flags.team || flags.space) {
      setDefaultSpace(await chooseSpace(getDefaultTeam().id))
    }

    if (flags.team || flags.space || flags.list) {
      setDefaultList(await chooseList(getDefaultSpace().id))
      return
    }

    if (getApiKey()) {
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

    setApiKey(key.apiKey)

    const team = await chooseTeam()
    setDefaultTeam(team)
    const space = await chooseSpace(team.id)
    setDefaultSpace(space)
    setDefaultList(await chooseList(space.id))
  }
}
