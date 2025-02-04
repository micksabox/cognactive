# Localization

Localization works by using the `i18next` package. Everything is configured inside of this folder.
The localization works by using the `/app/i18n/locales` folder. This folder contains all the translations for the different languages. You can add new translations by adding new files to this folder and then changing the `resource.ts` file to include the new language.

The server part is set up in the `entry.server.tsx` file, and the client part, conversely, is in the `entry.client.tsx` file and also the `root.tsx` file.

The language is detected by the `Accept-Language` HTTP request header, a saved cookie or defaults to English.

## Server-side

Due to the fact that the server does not care about loading in additional resources as they are not send over the wire we
pass in `resources` to the `i18next` instance. This provides all the languages to your server which allows it to render
the correct language on the server.

## Client-side

The client-side is a bit more complicated. We do not want to load in all the languages on the client side as it would
be a lot of requests. Instead, we use the fetch backend to load in the language files on the client side. We have a resource route inside of the `routes` directory which is in charge of loading in the resources. This route is called `resource.locales` and it is used to load in the languages. The `resource.locales` route is set up to only load in the languages and namespaces that are needed. In production we cache these responses and in development we don't cache them.

## Automated Translations

Translation automation is setup using [`languine.ai`](https://languine.ai). The configuration is in the `languine.config.ts` file. After installing project dependencies using `npm install`, you can run the following command to see what languine can do:

```bash
npx languine available
```
