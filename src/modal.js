let modalEl = null;

export function createGameOverModal({ onRestart }) {
  if (modalEl) return;

  modalEl = document.createElement("div");
  modalEl.className = "modal-overlay";

  modalEl.innerHTML = `
    <div class="modal">
      <h2 class="modal-title">Game Over</h2>
      <p class="modal-score">
        Final Score: <span id="modalScore">0</span>
      </p>

      <button class="modal-button" id="restartBtn">
        Restart Game
      </button>
    </div>
  `;

  document.body.appendChild(modalEl);

  document.getElementById("restartBtn").addEventListener("click", () => {
    hideModal();
    onRestart();
  });
}

export function showModal(score) {
  if (!modalEl) return;
  document.getElementById("modalScore").textContent = score;
  modalEl.classList.add("active");
}

export function hideModal() {
  if (!modalEl) return;
  modalEl.classList.remove("active");
}
