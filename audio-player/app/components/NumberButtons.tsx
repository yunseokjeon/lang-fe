export default function NumberButtons() {
  return (
    <div
      className="grid grid-cols-5 gap-2.5 px-4"
      style={{ paddingBottom: "2.5rem" }}
    >
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          className="bg-rose-300/80 hover:bg-rose-300 text-slate-700 p-3.5 rounded-xl text-lg font-bold transition"
        >
          {num}
        </button>
      ))}
    </div>
  );
}
