<!-- 
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
-->

# Starten des Frontends
Zum Starten dieser Komponente wird mindestens das Backend benötigt.<br>
Mehr Informationen zum Starten finden Sie in der [Readme des Projektes](../../README.md#installationsanleitung) oder im [Backend](../Swift%20Postgres%20Driver/Swift/README.md).

## Lokal 
+ Bitte Fragen Sie die Entwickler nach einer **.env** Datei
    + diese wird benötigt um den Google Login zu gewährleisten
+ [config.tx](./config.ts)
    + bitte den aktuellen Pfad des Backends eintragen
      + auf localhost => http://localhost:8080
+ [Proxyeinstellungen](./lib/auth.ts)
    + hier die Variable **proxyON** umstellen
    + true => Sie arbeiten innerhalb eines Proxys 
    + false => Sie arbeiten außerhalb eines Proxys
+ `npm install`
+ `npm run build`
+ `npm start`
    + sollten sie die App im Development Modus starten wollen `npm run dev`

## Produktiv 
Bitte beachten Sie das die Produktivumgebung dieser Anwendung für den Betrieb innerhalb der Infrastruktur der TH-Wildau ausgelegt ist! <br>
+ Bitte Fragen Sie die Entwickler nach einer **.env** Datei
    + diese wird benötigt um den Google Login zu gewährleisten
+ [config.tx](./config.ts)
    + bitte den aktuellen Pfad des Backends eintragen
      + auf Beispielserver => http://10.100.8.137:8080
+ [Proxyeinstellungen](./lib/auth.ts)
    + hier die Variable **proxyON** umstellen
    + true => Sie arbeiten innerhalb eines Proxys 
    + false => Sie arbeiten außerhalb eines Proxys
+ `docker build -t frontend .`
+ `docker run -e TZ=Europe/Berlin -d --restart unless-stopped --name frontend --network swift-network -p 3000:3000 frontend`
+ Container anhalten und entfernen (im Falle eines Updates)
    + `docker stop frontend `
    + `docker rm frontend`