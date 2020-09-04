import * as childProcess from 'child_process'
import {promises as fs} from 'fs'
import generateHash from 'random-hash'
import {Command, flags} from '@oclif/command'
import {getDefaultList} from '../conf'
import {createTask, ClickUpTask} from '../clickup'
import * as inquirer from 'inquirer'
import cli from 'cli-ux'

// inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'))
// inquirer.registerPrompt('search-list', require('inquirer-search-list'))

const createTaskCli = (listId: string, task: ClickUpTask) => {
  cli.action.start('Creating task')
  createTask(listId, task)
  cli.action.stop()
}

export default class Init extends Command {
  static description = 'Initial set up of clickup cli'

  static examples = [
    '$ clp config',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    list: flags.boolean({char: 'l', description: 'Use it to specify list'}),
    space: flags.boolean({char: 's', description: 'Use it to specify space'}),
    team: flags.boolean({char: 't', description: 'Use it to specify team'}),
    description: flags.boolean({char: 'd', description: 'Use it to specify description'}),
  }

  static args = [
    {
      name: 'name',               // name of arg to show in help and reference with args[name]
      required: false,            // make the arg required with `required: true`
      description: 'Specify task name', // help description
    },
  ]

  async run() {
    const {flags, args} = this.parse(Init)

    const task: ClickUpTask = {
      name: args.name,
    }

    const listId = getDefaultList().id

    if (flags.description) {
      const fileName = `/tmp/${generateHash({length: 20})}`
      const editor = process.env.EDITOR || 'vi'

      const child = childProcess.spawn(editor, [fileName], {
        stdio: 'inherit',
      })

      child.on('exit', async (e, code) => {
        try {
          const data = await fs.readFile(fileName, 'utf-8')
          task.markdown_description = data.toString()
          fs.unlink(fileName)

          createTaskCli(listId, task)
        } catch (e) {
          const doCreateTask = await inquirer.prompt([{
            type: 'confirm',
            message: 'Description wasn\'t provided. Do you want to create task anyway ',
            name: 'yes',
            default: false,
          }])
          if (doCreateTask.yes) {
            createTaskCli(listId, task)
          }
        }
      })

      return
    }

    createTaskCli(listId, task)
  }
}
