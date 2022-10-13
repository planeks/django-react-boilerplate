# Django+React Boilerplate by PLANEKS

WIP. Not ready for production.

## How to create the project

Download the last version of the boilerplate from the repository: https://github.com/planeks/django-react-boilerplate

You can download the ZIP archive and unpack it to the directory, or clone the repository (but do not forget to clean the Git history in that case). 

Use the global find and replace for changing the string `NEWPROJECTNAME` in the files in the `backend` and `frontend` directories to the proper project name. The easiest way to do it just use `Replace` feature in the IDE.

There are four files where the changes should be done:

```
backend/config/settings.py
backend/config/urls.py
backend/templates/index.html
frontend/public/index.html
```

## How to install Docker and Docker Compose

You can use the following commands to install Docker on Ubuntu 20.04:

```shell
$ sudo apt install apt-transport-https ca-certificates curl software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
$ sudo apt update
$ apt-cache policy docker-ce
$ sudo apt install docker-ce
$ sudo systemctl status docker
$ sudo usermod -aG docker ${USER}
```

The last command is necessary to add the current user to the `docker` group
to allow using the `docker` command without `sudo`.

Use the following commands to install `docker-compose` 

```shell
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```

## Running the project on the local machine

You need to run the project locally during the development. First of all, you should create three env files: 

1. `.env` - project level environment variables
2. `backend/.env` - environment variables for the backend
3. `frontend/.env` - environment variables for the frontend

Copy the `dev.env` file to the `.env` file in the same directory.

```shell
$ cp dev.env .env
```

Open the `.env` file in your editor and specify the settings:

```shell
COMPOSE_IMAGES_PREFIX=newprojectname
REDIS_URL=redis://redis:6379/0
```

Please, use the value for `COMPOSE_IMAGES_PREFIX` that correlates with the project name. It will be used as the container images prefix for `docker-compose`.

Copy the `backend/dev.env` file to the `backend/.env` file in the same directory.

```shell
$ cp backend/dev.env backend/.env
```

Open the `backend/.env` file in your editor and specify the settings:

```shell
PYTHONENCODING=utf8
DEBUG=1
CONFIGURATION=dev
DJANGO_LOG_LEVEL=INFO
SECRET_KEY=<secret_key>
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=db
POSTGRES_USER=<user>
POSTGRES_PASSWORD=<db_password>
REDIS_URL=redis://redis:6379/0
SITE_URL=http://127.0.0.1:8000
FRONTEND_URLS=http://127.0.0.1:3000
```

Copy the `frontend/dev.env` file to the `frontend/.env` file in the same directory.

```shell
$ cp frontend/dev.env frontend/.env
```

Open the `frontend/.env` file in your editor and specify the settings:

```shell
REACT_APP_PROJECT_NAME=NEWPROJECTNAME
REACT_APP_BACKEND_URL=http://127.0.0.1:8000
```

You need to edit `Dockerfile`, `entrypoint` and `docker-compose.dev.yml` files if you need to add other directories to the container and define them as volumes.

Use the following command to build the containers:

```shell
$ docker-compose -f docker-compose.dev.yml build
```

Use the next command to run the project in detached mode:

```shell
$ docker-compose -f docker-compose.dev.yml up -d
```

Use the following command to run `bash` inside the container if you want to run a management command like Django interactive shell.

```shell
$ docker-compose -f docker-compose.dev.yml exec django bash
```

Or, you can run the temporary container:

```shell
$ docker-compose -f docker-compose.dev.yml run --rm django bash
```

## Running the project in PyCharm

> The Docker integration features are available only in the Professional version
of PyCharm.

Go to `Preferences` -> `Project` -> `Python Interpreter`. Click the gear icon
and select the `Add...` item.

Select `Docker Compose` and specify your configuration file (`local.yml`) and
the particular service.

You can also change the interpreter name for better readability later.

You need to specify remote interpreters for each of the containers you are working
with Python. For example, if you have three containers, like `django`, `celeryworker`
and `celerybeat`, you need to setup three remote interpreters.

Now you can go to `Run/Edit Configurations...` and add the particular running configurations.

You can use the standard `Django Server` configuration to run `runserver`
Specify the proper Python Interpreter and set `Host` option to `0.0.0.0`.
It is necessary, because the application server is running inside the container.

You can use `Python` configuration template to run Celery. Do not forget to
set the proper remote interpreter and working directory. Also, set the following options:

- `Script path` : `/usr/local/bin/watchgod`
- `Parameters` : `celery.__main__.main --args -A config worker --loglevel=info -P solo`

Here we use `watchgod` utility to automatically restart Celery if
the source code has been changed.

Also, create the similar configuration for Celery Beat. Use the following options:

- `Script path` : `/usr/local/bin/celery`
- `Parameters` : `-A config beat -l INFO`

Make sure you specify the proper path for `celerybeat.pid` with proper
access rights.

Also, you can configure the React run configuration, following the next documentation: https://www.jetbrains.com/help/pycharm/node-with-docker-compose.html


## Retrieving React production build

You should have a production build of React application to run React container on production server. To create this build locally use next commands:

```bash
$ cd frontend
$ npm install
$ npm run build
```

As a result, `frontend/build` folder will be created, and it can be pushed to the repository ready for production.

Another way to get a build is to change docker/react/entrypoint and include `npm run build` in it:

```bash
case "$1" in
    dev)
        exec npm start
    ;;
    prod)
        # Use the next line if you want to make production build before the server start
        npm run build # <- uncomment this line
        exec serve -s build
    ;;
esac
```

As a result, production build for React application will be created every time the React container is started. Note, `npm run build` requires additional RAM resources, and it can be impossible to make a build of application with large amount of components and dependencies on production server with small amount of RAM.

## Deploying the project to the server

We strongly recommend deploying the project with an unprivileged user instead of `root`.

> The next paragraph describes how to create new unprivileged users to the system. If you use AWS EC2 for example, it is possible that you already have such kind of user in your system by default. It can be named `ubuntu`. If such a user already exists you do not need to create another one.

You can create the user (for example `webprod`) with the following command:

```shell
$ adduser webprod
```

You will be asked for the password for the user. You can use [https://www.random.org/passwords/](https://www.random.org/passwords/) to generate new passwords.

Add the new user `webprod` to the `sudo` group:

```bash
$ usermod -aG sudo webprod
```

Now the user can run a command with superuser privileges if it is necessary.

Usually, you shouldn't log in to the server with a password. You should use the ssh key. If you don't have one yet you can create it easily on your local computer with the following command:

```bash
$ ssh-keygen -t rsa
```

You can find the content of your public key with the next command:

```bash
$ cat ~/.ssh/id_rsa.pub
```

Now, go to the server and temporarily switch to the new user:

```bash
$ su - webprod
```

Now you will be in your new user's home directory.

Create a new directory called `.ssh` and restrict its permissions with the following commands:

```bash
$ mkdir ~/.ssh
$ chmod 700 ~/.ssh
```

Now open a file in `.ssh` called `authorized_keys` with a text editor. We will use `nano` to edit the file:

```bash
$ nano ~/.ssh/authorized_keys
```

> If your server installation does not contain `nano` then you can use `vi`. Just remember `vi` has different modes for editing text and running commands. Use `i` key to switch to the *insert mode*, insert enough text, and then use `Esc` to switch back to the *command mode*. Press `:` to activate the command line and type `wq` command to save file and exit. If you want to exit without saving the file just use `q!` command.

Now insert your public key (which should be in your clipboard) by pasting it into the editor. Hit `CTRL-x` to exit the file, then `y` to save the changes that you made, then `ENTER` to confirm the file name (in the case if you use `nano` of course).

Now restrict the permissions of the `authorized_keys` file with this command:

```bash
$ chmod 600 ~/.ssh/authorized_keys
```

Type this command once to return to the root user:

```bash
$ exit
```

Now your public key is installed, and you can use SSH keys to log in as your user.

Type `exit` again to logout from `the` server console and try to log in again as `webprod` and test the key based login:

```bash
$ ssh webprod@XXX.XXX.XXX.XXX
```

If you added public key authentication to your user, as described above, your private key will be used as authentication. Otherwise, you will be prompted for your user's password.

Remember, if you need to run a command with root privileges, type `sudo` before it like this:

```bash
$ sudo command_to_run
```

We also recommend to install a necessary software:

```bash
$ sudo apt install -y git wget tmux htop mc nano build-essential
```

And install Docker and Docker Compose as it was described above.

Create a new group on the host machine with `gid 1024` . It will be important for allowing to setup correct non-root permissions to the volumes.

```bash
$ sudo addgroup --gid 1024 django
```

> NOTE. If you cannot use the GID 1024 for any reason, you can choose other value but edit the `Dockerfile` as well.

And add your user to the group:

```bash
$ sudo usermod -aG django ${USER}
```

Create the directory for projects and clone the source code:

```bash
$ mkdir ~/projects
$ cd ~/projects
$ git clone <git_remote_url>
```

> Use your own correct Git remote directory URL.

Go inside the project directory and do the next to create initial volumes:

```bash
$ source ./init_production_volumes.sh
```

You need to create three env files with proper settings: 

1. `.env` - project level environment variables
2. `backend/.env` - environment variables for the backend
3. `frontend/.env` - environment variables for the frontend

Copy the `prod.env` file to the `.env` file in the same directory.

```shell
$ cp prod.env .env
```

Open the `.env` file in your editor and specify the settings:

```shell
COMPOSE_IMAGES_PREFIX=newprojectname
REDIS_URL=redis://redis:6379/0
CELERY_FLOWER_USER=flower
CELERY_FLOWER_PASSWORD=<flower_password>
```

The value `COMPOSE_IMAGES_PREFIX` can be the same as for `dev` configuration. It is a prefix for the container images.

Copy the `backend/prod.env` file to the `backend/.env` file in the same directory.

```shell
$ cp backend/prod.env backend/.env
```

Open the `backend/.env` file in your editor and specify the settings:

```shell
PYTHONENCODING=utf8
DEBUG=0
COLLECTSTATIC_ON_STARTUP=1
CONFIGURATION=prod
DJANGO_LOG_LEVEL=INFO
SECRET_KEY="<secret_key>"
ALLOWED_HOSTS=example.com
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=db
POSTGRES_USER=dbuser
POSTGRES_PASSWORD=<db_password>
REDIS_URL=redis://redis:6379/0
SITE_DOMAIN=example.com
SITE_URL=https://example.com
SENTRY_DSN=<sentry_dsn>
```

Change the necessary settings. Please check the `ALLOWED_HOSTS` settings that should
contain the correct domain name. Also, you need to change the `SITE_DOMAIN` value that is using with configuring Caddy.

Copy the `frontend/prod.env` file to the `frontend/.env` file in the same directory.

```shell
$ cp frontend/prod.env frontend/.env
```

Open the `frontend/.env` file in your editor and specify the settings:

```shell
REACT_APP_PROJECT_NAME=NEWPROJECTNAME
REACT_APP_BACKEND_URL=<backend_url>
```

Please check the `REACT_APP_BACKEND_URL` it should match the `SITE_URL` from `backend/.env`.

Now you can run the containers:

```bash
$ docker-compose -f docker-compose.prod.yml build
$ docker-compose -f docker-compose.prod.yml up -d
```

Also, you can setup the Cron jobs to schedule backups and cleaning unnecesary Docker data.

```bash
$ sudo crontab -e
```

Add the next lines

```bash
0 2 * * *       docker system prune -f >> /home/webprod/docker_prune.log 2>&1
0 1 * * *       cd /home/webprod/projects/my_project && /usr/local/bin/docker-compose -f docker-compose.prod.yml exec -T postgres backup >> /home/webprod/my_project_backup.log 2>&1
```
