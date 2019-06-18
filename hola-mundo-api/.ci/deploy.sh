docker build -t $PACKAGE_LOCATION . --target prod

bash ./.ci/heroku-deploy.sh $HEROKU_APP_NAME $HEROKU_PROC_NAME $PACKAGE_LOCATION
bash ./.ci/heroku-release.sh $HEROKU_APP_NAME $HEROKU_PROC_NAME

#bash ./.ci/ecs-deploy.sh $ECS_REPO $PACKAGE_LOCATION
