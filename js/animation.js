function showJobList() {
    const jobList = document.getElementById('job-list');
    jobList.classList.remove('hidden'); // Mostra os cartões
}

// Função para remover a mensagem de boas-vindas após um tempo
function removeWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcome-message');

    // Define um tempo para remover a mensagem (ex: 3 segundos)
    setTimeout(() => {
        welcomeMessage.remove(); // Remove a mensagem do DOM
        showJobList(); // Mostra os cartões
    }, 1000); // 3000 milissegundos = 3 segundos
}

// Inicia a animação ao carregar o documento
document.addEventListener('DOMContentLoaded', removeWelcomeMessage);
