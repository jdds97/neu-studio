/**
 * Utility to read Keystatic singleton/collection YAML content at build time.
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const contentDir = path.join(process.cwd(), 'src/content');

/** Read a singleton YAML file (e.g. 'site' reads src/content/site.yaml) */
export function getSingleton<T extends Record<string, unknown>>(name: string): T {
  const filePath = path.join(contentDir, `${name}.yaml`);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return yaml.load(raw) as T;
  } catch {
    return {} as T;
  }
}

/** Read all YAML files from a collection directory */
export function getCollection<T extends Record<string, unknown>>(name: string): T[] {
  const dirPath = path.join(contentDir, name);
  try {
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));
    return files.map((file) => {
      const raw = fs.readFileSync(path.join(dirPath, file), 'utf-8');
      return yaml.load(raw) as T;
    });
  } catch {
    return [];
  }
}
