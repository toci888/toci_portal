document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/scenes')
      .then(res => res.json())
      .then(data => {
        const scenesSection = document.getElementById('scenes');
        data.forEach(scene => {
          const sceneCard = document.createElement('div');
          sceneCard.innerHTML = `
            <h2>${scene.title}</h2>
            <p>${scene.description}</p>
          `;
          scenesSection.appendChild(sceneCard);
        });
      })
      .catch(err => console.error(err));
  });
  