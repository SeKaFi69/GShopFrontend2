import { Show, createEffect, createSignal } from "solid-js";
import { useAppContext } from "../appContext";
import style from "./Cart.module.css";
import type { Product } from "../appContext";

export default function Cart() {
  const appContext = useAppContext()!;
  const [total, setTotal] = createSignal(0);
  createEffect(() => {
    const totalTemp = appContext?.cart
      .cart()
      .reduce(
        (acc: number, product: Product) =>
          acc + product.price * product.amount!,
        0
      );
    setTotal(totalTemp);
  });

  const handleRemove = (name: string) => {
    appContext.cart.setItemCount(appContext.cart.itemCount() - 1);
    console.log(appContext.cart.itemCount());

    const currentProductIndex = appContext?.cart
      .cart()
      .findIndex((v) => v.name === name);
    if (currentProductIndex === -1) {
      return;
    }
    appContext?.cart.setCart((prev) => {
      prev[currentProductIndex].amount! -= 1;
      if (prev[currentProductIndex].amount! <= 0) {
        prev.splice(currentProductIndex, 1);
      }
      return [...prev];
    });
  };
  return (
    <Show when={appContext.cart.showCart()}>
      <>
        <span
          class={style.overlay}
          onclick={() => appContext.cart.setShowCart(false)}
        />
        <div class={style.cartContainer}>
          <h2>Koszyk</h2>
          <ul>
            <Show
              when={appContext.cart.cart().length > 0}
              fallback={"Koszyk jest pusty"}
            >
              {appContext?.cart.cart().map((product: Product) => (
                <li>
                  <span>
                    {product.name} - {product.price} zł
                  </span>
                  <span>{product.amount}</span>
                  <button
                    type="button"
                    title="Usuń"
                    onClick={() => handleRemove(product.name)}
                  >
                    Usuń
                  </button>
                </li>
              ))}
            </Show>
            <Show when={total() !== 0}>
              <span class={style.total}>Total: {`${total()}zł`}</span>
              <button type="button">Zamów</button>
            </Show>
          </ul>
        </div>
      </>
    </Show>
  );
}
