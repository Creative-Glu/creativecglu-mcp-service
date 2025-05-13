# creativecglu-mcp-service V0.0.1

- Creativeglu MCP Service

  - Production
  - Develop

### installation it as:

```
npm install
```

### Run it as:

```
npm start
```

### Node Version:

```
node = v20.15.1 ^
npm = v10.7.0 ^
```

### Git flow to merge at public branches:

```
git pull develop
git branch -b 'create your branch locally'
git add .
git commit -m 'Conventional commit message pattern'
git checkout develop
git pull
git checkout 'your created branch'
git rebase develop
git push origin 'your created branch'

Note: If you encounter conflict
fix your conflict first
git add .
git rebase --continue

on the terminal you can click the github link to request PR

Done

Cheers
```

### Pushing stages

```
dev -> master

dev = git pull to develop branch -> git checkout test & git rebase develop & git push
master = git pull to dev branch -> git rebase dev & git push
```