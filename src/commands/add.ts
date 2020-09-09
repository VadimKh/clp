import * as childProcess from 'child_process'
import {promises as fs} from 'fs'
import generateHash from 'random-hash'
import {Command, flags} from '@oclif/command'
import {getDefaultList, getDefaultTeam, getDefaultSpace} from '../conf'
import {createTask, ClickUpTask} from '../clickup'
import * as inquirer from 'inquirer'
import cli from 'cli-ux'
import {chooseTeam, chooseSpace, chooseList, chooseStatus} from '../utils'

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
    space: flags.boolean({description: 'Use it to specify space'}),
    team: flags.boolean({description: 'Use it to specify team'}),
    description: flags.boolean({char: 'd', description: 'Use it to specify description'}),
    status: flags.boolean({char: 's', description: 'Use it to specify status'}),
  }

  static args = [
    {
      name: 'name',               // name of arg to show in help and reference with args[name]
      required: true,            // make the arg required with `required: true`
      description: 'Specify task name', // help description
    },
  ]

  async run() {
    const {flags, args} = this.parse(Init)

    const task: ClickUpTask = {
      name: args.name,
    }

    let listId = getDefaultList().id
    let teamId = getDefaultTeam().id
    let spaceId = getDefaultSpace().id

    if (flags.team) {
      teamId = (await chooseTeam()).id
    }

    if (flags.team || flags.space) {
      spaceId = (await chooseSpace(teamId)).id
    }

    if (flags.team || flags.space || flags.list) {
      listId = (await chooseList(spaceId)).id
    }

    if (flags.status) {
      task.status = (await chooseStatus(listId))
    }

    if (flags.description) {
      const fileName = `/tmp/${generateHash({length: 20})}.md`
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
