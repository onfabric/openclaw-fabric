import { cli } from '../lib/openclaw';
import { getSkillPath, Skill } from '../lib/skills';

const EVERY_DAY_AT_MIDNIGHT = '0 0 * * *';

function register() {
  cli.cron.add({
    cronExpression: EVERY_DAY_AT_MIDNIGHT,
    name: 'fabric-deep-user-profile-cron',
    prompt: `Use the ${getSkillPath(Skill.DEEP_USER_PROFILE)} skill to update the user profile.`,
  });
}

export const cron = {
  register,
};
