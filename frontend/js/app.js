document.addEventListener('DOMContentLoaded', () => {
    const publicScenesContainer = document.getElementById('publicScenesContainer');
    const userSummaryContainer = document.getElementById('userSummaryContainer');
    const commentsContainer = document.getElementById('commentsContainer');
  
    // Fetch and display Public Scenes
    fetch('http://localhost:3000/api/views/public_scenes_with_users')
      .then(response => response.json())
      .then(data => {
        data.forEach(scene => {
          const sceneDiv = document.createElement('div');
          sceneDiv.innerHTML = `
            <h3>${scene.title}</h3>
            <p>${scene.description}</p>
            <p><strong>Autor:</strong> ${scene.author}</p>
            <p><strong>Polubienia:</strong> ${scene.likes_count} | <strong>Komentarze:</strong> ${scene.comments_count}</p>
          `;
          publicScenesContainer.appendChild(sceneDiv);
        });
      })
      .catch(err => console.error('Error fetching public scenes:', err));
  
    // Fetch and display User Summary
    fetch('http://localhost:3000/api/views/user_activity_summary')
      .then(response => response.json())
      .then(data => {
        data.forEach(user => {
          const userDiv = document.createElement('div');
          userDiv.innerHTML = `
            <h3>${user.username}</h3>
            <p><strong>Sceny publiczne:</strong> ${user.scenes_count}</p>
            <p><strong>Komentarze:</strong> ${user.comments_count}</p>
          `;
          userSummaryContainer.appendChild(userDiv);
        });
      })
      .catch(err => console.error('Error fetching user activity summary:', err));
  
    // Fetch and display Comments
    fetch('http://localhost:3000/api/views/comments_with_authors_and_scenes')
      .then(response => response.json())
      .then(data => {
        data.forEach(comment => {
          const commentDiv = document.createElement('div');
          commentDiv.innerHTML = `
            <p><strong>${comment.author}</strong> on <em>${comment.scene_title}</em></p>
            <p>${comment.content}</p>
          `;
          commentsContainer.appendChild(commentDiv);
        });
      })
      .catch(err => console.error('Error fetching comments:', err));
  });
  