import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.scss";

import { useAuth } from "../hooks/useAuth";
import { getAllDishes, createDish } from "../lib/dishes";

import Link from "next/link";
import Dish from "../components/Dish";
import DishForm from "../components/DishForm";

export default function Home({ dishes: defaultDishes }) {
  const [dishes, updateDishes] = useState(defaultDishes);

  const { user, logIn, logOut } = useAuth();

  async function handleOnSubmit(data: any, e) {
    e.preventDefault();

    await createDish(data);

    const dishes = await getAllDishes();
    updateDishes(dishes);
  }

  // console.log("user:", user);
  // console.log("dishes:", dishes);

  return (
    <div className={styles.container}>
      <Head>
        <title>Tastiest</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!user && (
        <p>
          <button onClick={logIn}>Log in</button>
        </p>
      )}
      {user && (
        <p>
          <button onClick={logOut}>Log out</button>
        </p>
      )}

      <main className={styles.main}>
        <ul>
          {dishes.map((dish) => {
            return (
              <Dish
                key={dish.id}
                url={dish.url}
                image={dish.image[0].url}
                dishName={dish.name}
                time={dish.time}
                cost={dish.cost}
                needed={dish.neededIngredients}
                available={dish.availableIngredients}
              />
            );
          })}
        </ul>

        <Link href={"/missingIngredients"}>Missing Ingredients</Link>

        {user && (
          <>
            <p>Render stuff once a user is logged in!</p>
            <DishForm onSubmit={handleOnSubmit}></DishForm>
          </>
        )}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const dishes = await getAllDishes();

  return {
    props: {
      dishes,
    },
  };
}
