function CartOverview() {
  return (
    <div className="bg-stone-800 px-4 py-4 uppercase text-stone-200 sm:px-6 ">
      <p className="space-x-4 font-semibold text-stone-300">
        <span>23 pizzas</span>
        <span>$23.45</span>
      </p>
      <a href="#">Open cart &rarr;</a>
    </div>
  );
}

export default CartOverview;
