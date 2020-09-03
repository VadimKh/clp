import Conf from 'conf'
import {ClickUpTeam, ClickUpSpace, ClickUpList} from '../clickup'

const API_KEY = 'api_key'
const DEFAULT_TEAM = 'default_team'
const DEFAULT_SPACE = 'default_space'
const DEFAULT_LIST = 'default_list'

export const getApiKey = (): string => {
  const conf = new Conf()
  return conf.get(API_KEY) as string
}

export const setApiKey = (key: string) => {
  const conf = new Conf()
  conf.set(API_KEY, key)
}

export const setDefaultTeam = (t: ClickUpTeam) => {
  const conf = new Conf()
  conf.set(DEFAULT_TEAM, t)
}

export const getDefaultTeam = (): ClickUpTeam => {
  const conf = new Conf()
  return conf.get(DEFAULT_TEAM) as ClickUpTeam
}

export const setDefaultSpace = (s: ClickUpSpace) => {
  const conf = new Conf()
  conf.set(DEFAULT_SPACE, s)
}

export const getDefaultSpace = (): ClickUpSpace => {
  const conf = new Conf()
  return conf.get(DEFAULT_SPACE) as ClickUpSpace
}

export const setDefaultList = (l: ClickUpList) => {
  const conf = new Conf()
  conf.set(DEFAULT_LIST, l)
}

export const getDefaultList = (): ClickUpList => {
  const conf = new Conf()
  return conf.get(DEFAULT_LIST) as ClickUpList
}
