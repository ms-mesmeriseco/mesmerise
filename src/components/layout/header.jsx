export default function Header() {
  return (
    <>
    <header className="fixed flex flex-row justify-between items-center w-fill z-50 p-6 box-border">
      <span className="w-1/3">
      <a href="../">
        <img src="/logo_white-MESMERISE.png" alt="MESMERISE Logo" className="w-full h-auto" />
      </a>
      </span>
      <span>this will be site menu</span>
      <span>
        <button className="bg-white text-black px-4 py-2 rounded-(--radius-sm)">CTA</button>
      </span>
    </header>
    </> 
  );
}