import * as path from 'node:path';
import { PLUGIN_ID } from './config';

const FABRIC_PLUGIN_SKILLS_DIR = path.join('~/.openclaw/extensions', PLUGIN_ID, 'skills');
const SKILL_FILE_NAME = 'SKILL.md';

export enum Skill {
  USER_CHECK_IN = 'user-check-in',
}

export function getSkillPath(skill: Skill): string {
  return path.join(FABRIC_PLUGIN_SKILLS_DIR, skill, SKILL_FILE_NAME);
}
