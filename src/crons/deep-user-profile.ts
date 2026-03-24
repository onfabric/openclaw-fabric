import { cli } from '../lib/openclaw';
import { getSkillPath, Skill } from '../lib/skills';

const EVERY_DAY_AT_MIDNIGHT = '0 0 * * *';

async function register() {
  const deepUserProfileSkill = getSkillPath(Skill.DEEP_USER_PROFILE);

  await cli.cron.add({
    cronExpression: EVERY_DAY_AT_MIDNIGHT,
    name: 'fabric-deep-user-profile-cron',
    prompt: `Use the ${deepUserProfileSkill} skill to update the user profile.`,
  });
}

export const cron = {
  register,
};
