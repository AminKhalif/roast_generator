import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Restore your old face photos and keep the memories alive."
          />
          <meta property="og:site_name" content="restorePhotos.io" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "keq0xqx8yd");
              `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              <!-- Google tag (gtag.js) -->
              <script async src="https://www.googletagmanager.com/gtag/js?id=G-9JJMGSBR6Y"></script>
              <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              
                gtag('config', 'G-9JJMGSBR6Y');
              </script>
              `,
            }}
          />


          <meta
            property="og:description"
            content="Restore your old face photos and keep the memories alive."
          />
          <meta property="og:title" content="Don't get it?" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="CanYouExplainTheJoke" />
          <meta
            name="twitter:description"
            content="Don't get a joke on the internet? Instead of looking like a clown, get an AI to explain it."
          />
          <meta
            property="og:image"
            content="/og-image.png"
          />
          <meta
            name="twitter:image"
            content="/og-image.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
