# MovieStream

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

npm upgrade

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Docker install
-- ensure opc is part of the docker group
-- otherwise, you will get a permissions error when trying to connect to docker
sudo groupadd docker
sudo usermod -aG docker ${USER}
-- log out and back in


## Build the docker
-- Go to the directory containing moviestream's docker file
docker build -t mgubar/moviestream:1.0 .

## Run it
sudo docker run -it -p 80:8080 -d --name moviestream mgubar/moviestream:1.0