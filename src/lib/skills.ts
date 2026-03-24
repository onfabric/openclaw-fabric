import * as path from 'node:path';
import { PLUGIN_ID } from './config';

const FABRIC_PLUGIN_SKILLS_DIR = path.join('~/.openclaw/extensions', PLUGIN_ID, 'skills');
const SKILL_FILE_NAME = 'SKILL.md';

export enum Skill {
  USER_CHECK_IN = 'user-check-in',
  DEEP_USER_PROFILE = 'deep-user-profile',
  RETRIEVE_RELEVANT_USER_MEMORIES = 'retrieve-relevant-user-memories',
}

export function getSkillPath(skill: Skill): string {
  return path.join(FABRIC_PLUGIN_SKILLS_DIR, skill, SKILL_FILE_NAME);
}
