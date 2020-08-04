# Harvester
Utility to log on harverst what you've been up to, so you dont forget your timers

Automatically log to Harvest when run `yarn harvest`;<br/>
_push a new timer for each run under different commit._

# Environment Variables:
```sh
HARVEST_ENABLE=false

# required (if HARVEST_ENABLE=true)
HARVEST_TOKEN=

# required (if HARVEST_ENABLE=true)
HARVEST_USER=
```

# Usage
#### Local installation, by project:
- Install `yarn add -D generous-harvester` | `npm i -D generous-harvester`
in `package.json`
```json
{
  "name": "your-app",
  "scripts": {
    "prestart": "harvest --project=### --task=### --jira PRJ"
  }
}
```

#### Global installation, by project:
- Install `yarn global add generous-harvester` | `npm i -g generous-harvester`
- export the env vars on your shell _(.zshrc|.bashrc..)_
```sh
export HARVEST_ENABLE=true
export HARVEST_USER=# YOUR_USER #
export HARVEST_TOKEN=# YOUR_TOKEN #
```
- then run `harvest --project=### --task=### --jira PRJ`

## Tips
- Follow branch naming convetions for optimal result: `{task}/{Ticket}/branch-name`
- Generate an API token, _(HARVEST_TOKEN)_ at https://id.getharvest.com/developers
- The project ID, and task, you can find inspecting the network of the harvest (in jira, or in harvest)
