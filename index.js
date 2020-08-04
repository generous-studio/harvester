#!/usr/bin/env node
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const yargs = require('yargs');
const util = require('util');
const fs = require('fs');
const axios = require('axios');
const exec = util.promisify(require('child_process').exec);

yargs
  .nargs('jira', 1)
  .example('$0 --jira PRJ', 'Link the jira project, and anotate on titles')
  .nargs('project', 1)
  .alias('p', 'project')
  .example('$0 --project=999..', 'The harvest project id')
  .nargs('task', 1)
  .example('$0 --task=999..', 'The harvest task id')
  .nargs('time', 1)
  .alias('t', 'time')
  .example('$0 --time=8.0', 'The harvest time to log, (decimals)')
  .demandOption(['project', 'task'])

const argv = yargs.argv;
dotenvExpand(dotenv.config({ path: './scripts/.env' }));
const { USER, HARVEST_TOKEN, HARVEST_USER, HARVEST_ENABLE } = process.env;
const JIRA_PREFIX = argv.jira;
const TASK = argv.task;
const PROJECT = argv.project;
const TIME = argv.time

if (!HARVEST_ENABLE) { process.exitCode = 0; return; }

const logPath = './harvest.log';

const lastUpdate = fs.existsSync(logPath) && fs.readFileSync(logPath, 'utf8');

(async () => {
  const [_branch, _commit] = await Promise.all([
    exec('git rev-parse --abbrev-ref HEAD'),
    exec(`git show-branch --no-name ${branch}`),
  ])
  const { stdout: branch } = _branch;
  const { stdout: latestCommit } = _commit;
  const [nature, ticket] = branch.split('/');
  const Ticket = (ticket && ticket.includes(`${JIRA_PREFIX}-`) && ticket) || '';

  if (lastUpdate === latestCommit) {
    process.exitCode = 0;
    return null;
  }

  return axios.post('https://api.harvestapp.com/v2/time_entries',
    {
      user_id: HARVEST_USER,
      project_id: PROJECT,
      task_id: TASK,
      notes: `[${branch}] ${latestCommit}`,
      spent_date: new Date().toISOString(),
      hours: TIME || 1.0,
      external_reference: {
        id: 0,
        group_id: '10566',
        permalink: `https://generous.atlassian.net/browse/${Ticket}`,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${HARVEST_TOKEN}`,
        'Harvest-Account-Id': 568754,
        'User-Agent': USER,
        origin: 'https://jira-harvest.42nd.co',
        referer: 'https://jira-harvest.42nd.co/',
      },
    })
    .then(() => fs.writeFileSync(logPath, latestCommit));
})()
  .catch(e => { console.error(e); process.exitCode = 1; });
