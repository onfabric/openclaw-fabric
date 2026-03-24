import { cli } from '../lib/openclaw';
import { getSkillPath, Skill } from '../lib/skills';

const EVERY_DAY_AT_MIDNIGHT = '0 0 * * *';
const CRON_NAME = 'fabric-deep-user-profile-cron';

async function register() {
  const deepUserProfileSkill = getSkillPath(Skill.DEEP_USER_PROFILE);

  const { jobs } = await cli.cron.list();
  const exists = jobs.some((job) => job.name === CRON_NAME);
  if (exists) {
    console.log(`⏭️ Cron job already exists, skipping: ${CRON_NAME}`);
    return;
  }

  await cli.cron.add({
    cronExpression: EVERY_DAY_AT_MIDNIGHT,
    name: CRON_NAME,
    prompt: `Use the ${deepUserProfileSkill} skill to update the user profile.`,
  });
}

export const cron = {
  register,
};
