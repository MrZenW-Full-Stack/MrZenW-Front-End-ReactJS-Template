#!/usr/bin/env bash

which rsync || apt-get install rsync -y
which ssh-agent || apt-get install openssh-client -y

eval $(ssh-agent -s)
echo "$UPLOADER_CLIENT_SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null
# add the ssh key stored in UPLOADER_CLIENT_SSH_PRIVATE_KEY variable to the agent store
# echo "$UPLOADER_CLIENT_SSH_PRIVATE_KEY" | ssh-add -
ssh-add <(echo "$UPLOADER_CLIENT_SSH_PRIVATE_KEY")
mkdir -p ~/.ssh
[[ -f /.dockerenv ]] && echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config
chmod 700 ~/.ssh
ssh-keyscan gitlab.com >> ~/.ssh/known_hosts
chmod 644 ~/.ssh/known_hosts

DATE=`date '+%Y%m%d'`
TIME=`date '+%H%M%S'`

export APP_PUBLIC_DIR="_app_/$DATE/$TIME/"

export API_BASE_URL=//api.mrzenw.com/api
export WEBSITE_APP_URL=mrzenw.com
export PRODUCTION_SERVER_TYPE=production

if [ "$APP_VERSION" = "" ]
then
  export APP_VERSION=$CI_COMMIT_TAG
fi

### GIT production
if [[ -d .git ]]
then
  export GIT_LATEST_TAG=$(git describe --tags --abbrev=0)
  export GIT_CURRENT_HASH_SHORT=$(git rev-parse --short HEAD)
  export GIT_CURRENT_HASH_DATETIME=$(git show -s --date=format:'%Y%m%d_%H%M%S' --format=%cd $GIT_CURRENT_HASH_SHORT)
  export APP_VERSION="$GIT_CURRENT_HASH_DATETIME"__"$GIT_CURRENT_HASH_SHORT"
  ## clean git directory
  # https://stackoverflow.com/questions/1146973/how-do-i-revert-all-local-changes-in-git-managed-project-to-previous-state
  git checkout production
  git reset
  git reset --hard
  git clean -f
  git clean -fd
  git status
  rm -rf .git
fi
### GIT production END

### BUILD
rm -rf dist/
npm run build:vendors -- --mode production --env production
npm run lint
npm run test
npm run build -- --mode production --env production
# tail -n 100 npm_run_build.txt
### BUILD END

### SENTRY
export SENTRY_AUTH_TOKEN='PUT YOUR SENTRY TOKEN HERE'
export SENTRY_ORG='mrzenw'
export SENTRY_PROJECT='mrzenw_front_end_reactjs_template'

curl -sL https://sentry.io/get-cli/ | bash
sentry-cli releases new "$APP_VERSION" --finalize
sentry-cli releases files "$APP_VERSION" upload-sourcemaps dist/ > sentry-cli.output.txt
tail -n 100 sentry-cli.output.txt
sentry-cli releases deploys $APP_VERSION new -e production
### SENTRY END

### UPLOAD
# /usr/bin/env bash ./cicd/tool.empty_all_map_files.sh
ssh root@${HOST} "node -v"
ssh root@${HOST} "npm -v"
ssh root@${HOST} "mkdir -p /var/www/mrzenw_front_end_reactjs_template/production/dist" || echo 'Directiory exists'
rsync --progress -za -e ssh --delete dist/ root@${HOST}:/var/www/mrzenw_front_end_reactjs_template/production/dist/
### UPLOAD END

### DONE
echo "APP_VERSION: $APP_VERSION";
[[ -d .git ]] && git status
### DONE END

echo '!!!PUBLISH FINISHED!!!'
