export default function Header() {
  return (
    <>
    <header className="fixed z-50 flex flex-row justify-between items-center w-fill p-6 box-border">
      <span className="w-1/3">
      <a href="../">
        <img src="/logo_white-MESMERISE.png" alt="MESMERISE Logo" className="w-full h-auto" />
      </a>
      </span>
      <span>this will be site menu</span>
      <span>
        <button className="bg-white text-black px-4 py-0 rounded-(--radius-lrg)">CTA</button>
      </span>
    </header>
    </> 
  );
}