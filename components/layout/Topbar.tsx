// Barre supérieure : raccourcis + déconnexion. Le bouton poste vers /auth/signout.
export function Topbar({ name, streak, dueToday }: { name: string; streak: number; dueToday: number }) {
  return (
    <header className="topbar">
      <span className="pill">Bonjour, {name}</span>
      {streak > 0 && <span className="pill accent">🔥 {streak} j</span>}
      <span className="pill">À réviser : {dueToday}</span>
      <form action="/auth/signout" method="post" style={{ margin: 0 }}>
        <button className="pill" type="submit" style={{ cursor: "pointer" }}>Déconnexion</button>
      </form>
    </header>
  );
}
