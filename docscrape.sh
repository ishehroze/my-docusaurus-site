npm run build
npm run serve80&
docker run -it --rm --net docsearch --env-file=.env -e "CONFIG=$(cat config.json | jq -r tostring)" typesense/docsearch-scraper