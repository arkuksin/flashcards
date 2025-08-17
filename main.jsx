import React, { useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";

function App() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Итальянские карточки — 200 слов</h1>
      <p>Пример приложения. Список слов нужно ещё расширить.</p>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
