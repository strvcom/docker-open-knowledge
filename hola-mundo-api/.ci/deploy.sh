docker build -t $PACKAGE_LOCATION .
bash ./.ci/heroku-deploy.sh $HEROKU_APP_NAME $HEROKU_PROC_NAME $PACKAGE_LOCATION
bash ./.ci/heroku-release.sh $HEROKU_APP_NAME $HEROKU_PROC_NAME
