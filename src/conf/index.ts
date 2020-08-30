import Conf from 'conf'

const API_KEY = 'api_key'

export const getApiKey = () => {
  const conf = new Conf()
  return conf.get(API_KEY)
}

export const setApiKey = (key: string) => {
  const conf = new Conf()
  conf.set(API_KEY, key)
}
