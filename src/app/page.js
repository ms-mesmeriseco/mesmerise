import { gql } from "@apollo/client";
import { getClient } from "@/lib/apollo-client";
import { GET_HOME_PAGE } from "@/lib/graphql/queries/getHomePageContent";
import styles from './page.module.css';

export default async function Home() {
  const { data } = await getClient().query({ query: GET_HOME_PAGE });
  const page = data.homePageCollection.items[0];
  const blocks = page.pageBlocksCollection.items;
  console.log(blocks);

const heroStyle = {
  backgroundImage: `url(${page.heroImage.url})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};
  return (
    <div className={styles.page}>
      <div className={styles.hero} style={heroStyle}>
      <main className={styles.main}>
     
       {blocks.map((block) => {
          if (block.__typename === "ComponentHeroBanner" && block.heroMedia) {
            console.log(block.heroMedia.url);
            return (
              <section key={block.sys.id}>
                <img
                  src={block.heroMedia.url}
                  alt={block.heroMedia.title || "Hero Image"}
                  width={block.heroMedia.width}
                  height={block.heroMedia.height}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                
              </section>
            );
          }

          return null;
        })}
        <h1>{page.pageTitle}</h1>
      </main>
      </div>
    </div>
  );
}