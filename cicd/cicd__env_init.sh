BASEDIR=$(dirname "$0")

cat $BASEDIR/../.env || echo 'no .env file'
rm -rf $BASEDIR/../.env
rm -rf $BASEDIR/../node_modules
rm -rf $BASEDIR/../dist

if [ "${CICD_PIPE_NAME}" = "" ]; then
  echo "\r\nCICD_PIPE_NAME cannot be empty"
  exit 101
fi

## install git
apt-get update -y
apt-get install git -y

export UPLOADER_CLIENT_SSH_PRIVATE_KEY=`cat $BASEDIR/UPLOADER_CLIENT_SSH_PRIVATE_KEY.txt`

export HOST='128.199.204.144'

printenv
