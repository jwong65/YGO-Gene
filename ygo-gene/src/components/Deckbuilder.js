import { useEffect, useState } from "react";

export default function Deckbuilder() {
  const [cards, setCards] = useState([]);       // All cards from local JSON
  const [deck, setDeck] = useState([]);         // Player’s deck
  const [search, setSearch] = useState("");     // Search term

  // Calculate total points of the current deck
  const points = deck.reduce((sum, c) => sum + (c.genesys_points || 0), 0);

  // Load local JSON on component mount
  useEffect(() => {
    fetch("/data/cards.json")  // Assuming you placed the JSON in public/data/
      .then((res) => res.json())
      .then((data) => setCards(data.data))
      .catch((err) => console.error("Failed to load cards:", err));
  }, []);

  // Add card to deck with 100-point limit
  function addCard(card) {
    if (points + card.genesys_points > 100) {
      alert("You cannot exceed 100 points!");
      return;
    }
    setDeck([...deck, card]);
  }

  // Remove card from deck by index
  function removeCard(index) {
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    setDeck(newDeck);
  }

  // Filter cards based on search input
  const filteredCards = cards.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      <div style={{ width: "50%" }}>
        <h2>Card Browser</h2>
        <input
          type="text"
          placeholder="Search cards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />

        <ul style={{ maxHeight: "600px", overflowY: "scroll", border: "1px solid #ccc", padding: "1rem" }}>
          {filteredCards.map((c) => (
            <li key={c.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {c.card_images?.[0]?.image_url && (
                  <img src={c.card_images[0].image_url} alt={c.name} style={{ width: "40px", height: "60px" }} />
                )}
                <span>{c.name} ({c.genesys_points})</span>
              </div>
              <button onClick={() => addCard(c)}>Add</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Player Deck */}
      <div style={{ width: "50%" }}>
        <h2>My Deck – {points} / 100 Points</h2>
        <ul>
          {deck.map((c, i) => (
            <li key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span>{c.name} ({c.genesys_points})</span>
              <button onClick={() => removeCard(i)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
