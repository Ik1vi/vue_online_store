set -e

npm run build

cd dist

git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/Ik1vi/vue_online_store_deploy.git master:gh-pages

cd -
