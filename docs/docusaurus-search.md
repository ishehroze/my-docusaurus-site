---
id: docusaurus-search
title: Enabling search facility in Docusaurus
#sidebar_label: <specify if it is other than title>
#description: <optional>
slug: docusaurus-search
#sidebar_position: <specify after confirming order>
---

<!-- vale Microsoft.Headings = NO -->

## Installing Typesense using Docker

<!-- vale Microsoft.Headings = YES -->

1. Create a volume named `typesense-data`
2. Create a bridge network named `docsearch`
3. Run the following command to create a typesense container:

```bash
docker run --name typesense -p 8108:8108 -v typesense-data:/data --net docsearch typesense/typesense:0.22.0.rcs41 --data-dir /data --api-key=xyz –-enable-cors
```

:::note

You can specify other tag than `0.22.0.rcs41` for the `typesense` image. But as
of the date of writing this document, the default `latest` tag doesn't work
while pulling the image from dockerhub.

:::

:::important

You need to specify the collection (like tables in relational database) where
the docsearch scraper will store the search data in typesense. Also, you need to
specify the URL of the documentation site and the API key for interacting with
the typesense API service. Throughout this document, you will see the values as
follows:

| Particular           | Value                       |
| -------------------- | --------------------------- |
| Typesense collection | `ababilng-docusaurus`       |
| Documentation URL    | `http://192.168.1.140/doc/` |
| Typesense API key    | `xyz`                       |

You may need to replace them to match your use case.

:::

:::caution

Make sure that the documentation site runs on the default port for HTTP (80) or
HTTPS (443) so that the URL can omit the port number. Otherwise, the docsearch
scraper won't work. Also, You must make sure that the docker container serving
the documentation site is on the same custom docker bridge network `docsearch`
as the typesense server. Otherwise, the docusaurus site won't be able to access
the typesense server using host `typesense` resulting in failure of search
functionality.

:::

## Configuring docusaurus

1. Run the following command in the docusaurus project directory:

   ```bash
   yarn add docusaurus-theme-search-typesense
   ```

2. Specify proper `url` and `baseUrl` properties in `docusaurus.config.js`.

   ```javascript
   {
       url: 'http://192.168.1.140/',
       baseUrl: '/doc/',
   }
   ```

3. Add `docusaurus-theme-search-typesense` to the list of themes.

   ```javascript
   {
       themes: ['docusaurus-theme-search-typesense'],
   }
   ```

4. Set `themeConfig` property in the `docusaurus.config.js` for `typesense` as
   follows:

   ```javascript
    {
        themeConfig: {
            typesense: {
                typesenseCollectionName: 'ababilng-docusaurus',
                typesenseServerConfig: {
                    nodes: [
                        {
                            host: 'typesense',
                            port: 8108,
                            protocol: 'http',
                        },
                    ],
                    apiKey: 'xyz',
                },

                typesenseSearchParameters: {},
                contextualSearch: true,
            },
    }
   ```

## Installing docsearch scraper

Create the following `config.json` file at a suitable location:

```json
{
  "index_name": "ababilng-docusaurus",
  "start_urls": ["http://192.168.1.140/doc/"],
  "sitemap_urls": ["http://192.168.1.140/doc/sitemap.xml"],
  "sitemap_alternate_links": true,
  "stop_urls": ["/tests"],
  "selectors": {
    "lvl0": {
      "selector": "(//ul[contains(@class,'menu__list')]//a[contains(@class, 'menu__link menu__link--sublist menu__link--active')]/text() | //nav[contains(@class, 'navbar')]//a[contains(@class, 'navbar__link--active')]/text())[last()]",
      "type": "xpath",
      "global": true,
      "default_value": "Documentation"
    },
    "lvl1": "header h1",
    "lvl2": "article h2",
    "lvl3": "article h3",
    "lvl4": "article h4",
    "lvl5": "article h5, article td:first-child",
    "lvl6": "article h6",
    "text": "article p, article li, article td:last-child"
  },
  "strip_chars": " .,;:#",
  "custom_settings": {
    "separatorsToIndex": "_",
    "attributesForFaceting": ["language", "version", "type", "docusaurus_tag"],
    "attributesToRetrieve": [
      "hierarchy",
      "content",
      "anchor",
      "url",
      "url_without_anchor",
      "type"
    ]
  },
  "conversation_id": ["833762294"],
  "nb_hits": 46250
}
```

Also, create a `.env` file at the same location.

```bash
TYPESENSE_API_KEY=xyz
TYPESENSE_HOST=typesense
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
```

[Install `jq`](https://stedolan.github.io/jq/download/) and run the following
command:

```bash
docker run -it --net docsearch --env-file=.env -e "CONFIG=$(cat config.json | jq -r tostring)" typesense/docsearch-scraper
```

:::caution

If you are using Windows, you will need to use Git Bash to run the command.

:::
