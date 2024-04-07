document.addEventListener('DOMContentLoaded', (event) => {
  // Setup click event listeners only after the DOM is fully loaded
  document.getElementById('missionCard').onclick = function() {
    document.getElementById('missionModal').style.display = "block";
  }
  document.getElementById('methodCard').onclick = function() {
    document.getElementById('methodModal').style.display = "block";
  }
  document.getElementById('credibilityCard').onclick = function() {
    document.getElementById('credibilityModal').style.display = "block";
  }

  document.getElementById('closeMission').onclick = function() {
    document.getElementById('missionModal').style.display = "none";
  }
  document.getElementById('closeMethod').onclick = function() {
    document.getElementById('methodModal').style.display = "none";
  }
  document.getElementById('closeCredibility').onclick = function() {
    document.getElementById('credibilityModal').style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
    }
  }
});