import {Command, flags} from '@oclif/command'
import {getApiKey, setApiKey, setDefaultTeam, setDefaultSpace, setDefaultList, getDefaultTeam, getDefaultSpace, getDefaultList} from '../conf'
import {getTeams, getSpaces, getLists} from '../clickup'
import * as inquirer from 'inquirer'
import cli from 'cli-ux'
import chalk from 'chalk'

// inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))
// inquirer.registerPrompt('search-list', require('inquirer-search-list'))

export default class Init extends Command {
  static description = 'Initial set up of clickup cli'

  static examples = [
    '$ clp init',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    list: flags.boolean({char: 'l', description: 'Use it to define default list'}),
    space: flags.boolean({char: 's', description: 'Use it to define default space'}),
    team: flags.boolean({char: 't', description: 'Use it to define default team'}),
    key: flags.boolean({char: 'k', description: 'Set Api Key only'}),
    display: flags.boolean({char: 'd', description: 'Show current configuration'}),
  }

  async run() {
    const {flags} = this.parse(Init)

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

    cli.action.start('Getting teams')
    const teams = await getTeams()
    cli.action.stop()

    inquirer.registerPrompt('search-list', require('inquirer-search-list'))

    const defaultTeam = await inquirer.prompt([{
      type: 'search-list',
      message: 'Choose default team: ',
      name: 'team',
      choices: teams.map(t => ({name: chalk.hex(t.color)(t.name), value: t})),
    }])
    setDefaultTeam(defaultTeam.team)

    cli.action.start('Getting spaces')
    const spaces = await getSpaces(defaultTeam.team.id)
    cli.action.stop()

    const defaultSpace = await inquirer.prompt([{
      type: 'search-list',
      message: 'Choose default space: ',
      name: 'space',
      choices: spaces.map(s => ({name: s.name, value: s})),
    }])

    setDefaultSpace(defaultSpace.space)

    cli.action.start('Getting lists')
    const lists = await getLists(defaultSpace.space.id)
    cli.action.stop()

    const defaultList = await inquirer.prompt([{
      type: 'search-list',
      message: 'Choose default list: ',
      name: 'list',
      choices: lists.map(l => ({name: l.name, value: l})),
    }])

    setDefaultList(defaultList.list)
  }
}