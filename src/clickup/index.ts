import fetch from 'node-fetch'

import {getApiKey} from '../conf'

const CLICKUP_ENDPOINT = 'https://api.clickup.com/api/v2/'

const fetchEndpoint = async (endpoint: string, options?: RequestInit) => {
  const url = CLICKUP_ENDPOINT + endpoint
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getApiKey(),
    },
  }

  const response = await fetch(url, fetchOptions)
  return response.json()
}

export const getTeams = async (): Promise<Array<ClickUpTeam>> => {
  const response: ClickUpTeamResponse = await fetchEndpoint('team?archived=false')
  return response.teams
}

export const getSpaces = async (teamId: string): Promise<Array<ClickUpSpace>> => {
  const response: ClickUpSpaceResponse = await fetchEndpoint(`team/${teamId}/space?archived=false`)
  return response.spaces
}

export const getFolders = async (spaceId: string): Promise<Array<ClickUpFolder>> => {
  const response: ClickUpFolderResponse = await fetchEndpoint(`space/${spaceId}/folder?archived=false`)
  return response.folders
}

export const getFolderlessLists = async (spaceId: string): Promise<Array<ClickUpList>> => {
  const response: ClickUpListResponse = await fetchEndpoint(`space/${spaceId}/list?archived=false`)
  return response.lists
}

export const getLists = async (spaceId: string): Promise<Array<ClickUpList>> => {
  let lists = await getFolderlessLists(spaceId) || []
  const folders = await getFolders(spaceId)
  if (!folders)
    return lists

  for (const folder of folders) {
    // eslint-disable-next-line no-await-in-loop
    const listResponse: ClickUpListResponse = await fetchEndpoint(`folder/${folder.id}/list?archived=false`)
    lists = lists.concat(listResponse.lists)
  }
  return lists
}

export const createTask = async (listId: string, task: ClickUpTask): Promise<ClickUpTask> => {
  const response = await fetchEndpoint(`list/${listId}/task`, {
    method: 'POST',
    body: JSON.stringify(task),
  })
  return response.task
}

export interface ClickUpTask {
  name: string;
  markdown_description?: string;
  description?: string;
  assignees?: number[];
  tags?: string[];
  status?: string;
  priority?: number;
  due_date?: number;
  due_date_time?: boolean;
}
export interface ClickUpFolder {
  id: string;
  name: string;
  orderindex: number;
  override_statuses: boolean;
  hidden: boolean;
  space: ClickUpSpace;
  task_count: number;
  list: Array<ClickUpList>;
}

export interface ClickUpList {
  id: string;
  name: string;
  orderindex: number;
  content: string;
  status: {
    status: string;
    color: string;
    hide_label: boolean;
  };
  priority: {
    priority: string;
    color: string;
  };
  assignee: object;
  task_count: number;
  due_date: string;
  due_date_time: boolean;
  start_date: object;
  start_date_time: object;
  folder: ClickUpFolder;
  space: ClickUpSpace;
  statuses: Array<ClickUpStatus>;
}

export interface ClickUpFolderResponse {
  folders: Array<ClickUpFolder>;
}

export interface ClickUpListResponse {
  lists: Array<ClickUpList>;
}

export interface ClickUpTeam {
  id: string;
  name: string;
  color: string;
  avatar: string;
  memebets: Array<any>;
}

export interface ClickUpTeamResponse {
  teams: Array<ClickUpTeam>;
}

export interface ClickUpSpace {
  id: string;
  name: string;
  private: boolean;
  statuses: Array<ClickUpStatus>;
}

export interface ClickUpStatus {
  status: string;
  type: string;
  orderindex: number;
  color: string;
}

export interface ClickUpUser {
  id: number;
  username: string;
  color: string;
  initials: string;
  email: string;
  profilePicture: string;
}

export interface ClickUpSpaceResponse {
  spaces: Array<ClickUpSpace>;
}

