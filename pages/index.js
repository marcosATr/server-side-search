import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home({ data, page: serverPage }) {
  const router = useRouter();
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    data?.results && setPokemon((prev) => [...prev, ...data?.results]);
  }, [serverPage]);

  function loadMore() {
    router.replace({
      query: {
        ...router.query,
        page: router.query?.page ? parseInt(router.query?.page) + 1 : 1,
      },
    });
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      {pokemon?.map((pokemon) => (
        <div key={pokemon?.name}>{pokemon?.name}</div>
      ))}
      <button onClick={loadMore}>Ver Mais</button>
    </main>
  );
}

export async function getServerSideProps(ctx) {
  const page = ctx.query?.page;
  const searchResults = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=6${
      !!page && `&offset=${page * 6}`
    }`
  ).then(async (res) => {
    return res.json();
  });

  return { props: { data: searchResults, page: page ?? 0 } };
}
