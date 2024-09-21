import yaml from 'js-yaml'
import { readFile } from 'fs/promises'

/**
 *
 */
export async function openYaml (path: string) {
  const config = await readFile(path, 'utf-8')
  return yaml.load(config)
}
