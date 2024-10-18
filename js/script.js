// Constante para a URL base da API
const BASE_URL = 'https://getask-backend.onrender.com';

// Função para gerar uma hash aleatória
function generateHash() {
    return Math.random().toString(36).substring(2, 10); // Exemplo simples de hash
}

// Função para criar um novo trabalho
const createJob = async () => {
    const jobData = gatherJobData();

    try {
        const response = await fetch(`${BASE_URL}/api/jobs/set`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobData),
        });

        if (!response.ok) throw new Error('Erro ao criar vaga');

        const result = await response.json();
        alert(result.message);
        toggleJobForm('create-job-form', true); // Esconde o formulário após a criação
        fetchAndDisplayJobs(); // Atualiza a lista de vagas
    } catch (error) {
        console.error('Erro ao criar vaga:', error);
    }
};

// Função para coletar dados do formulário
const gatherJobData = () => {
    const companyName = document.getElementById('company-name').value;
    const jobName = document.getElementById('job-name').value;
    const cidade = document.getElementById('create-cidade').value;
    const description = document.getElementById('description').value;
    const valor = document.getElementById('valor').value;
    const contato = document.getElementById('contato').value;
    const hash = generateHash(); // Gera uma hash aleatória

    return { companyName, jobName, cidade, description, valor, contato, hash };
};

// Função para buscar e exibir as vagas
const fetchAndDisplayJobs = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/jobs/getAll`);
        const jobs = await response.json();
        const cardsContainer = document.querySelector('.cards-container');
        cardsContainer.innerHTML = ''; // Limpa os cartões existentes

        jobs.forEach(job => createJobCard(job, cardsContainer));
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
    }
};

// Função para criar um cartão de trabalho
const createJobCard = (job, container) => {
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    jobCard.innerHTML = `
        <h2>${job.companyname}</h2>
        <h2>${job.jobname}</h2>
        <p><strong>Cidade:</strong> ${job.cidade}</p>
        <p><strong>Descrição:</strong> ${job.description}</p>
        <p><strong>Valor:</strong> ${job.valor}</p>
        <p><strong>Contato:</strong> ${job.contato}</p>
    `;
    container.appendChild(jobCard);
};

// Função para exibir/esconder formulários
const toggleJobForm = (formId, isHidden) => {
    document.getElementById(formId).classList.toggle('hidden', isHidden);
};

// Eventos para controle de formulários
document.getElementById('criar-btn').addEventListener('click', () => {
    toggleJobForm('create-job-form', false);
    document.getElementById('hash').value = generateHash(); // Gera hash ao abrir o formulário
});

document.getElementById('procurar-btn').addEventListener('click', () => {
    toggleJobForm('search-form', false);
});

document.getElementById('editar-btn').addEventListener('click', () => {
    toggleJobForm('edit-job-form', false);
    toggleJobForm('create-job-form', true);
});

document.getElementById('create-job-button').addEventListener('click', createJob);

document.getElementById('close-button-create').addEventListener('click', () => {
    toggleJobForm('create-job-form', true);
});

document.getElementById('close-button-edit').addEventListener('click', () => {
    toggleJobForm('edit-job-form', true);
});

document.getElementById('close-button-search').addEventListener('click', () => {
    toggleJobForm('search-form', true);
});


// Evento para buscar vaga por hash
document.getElementById('search-job-button').addEventListener('click', async () => {
    const hash = document.getElementById('edit-hash').value;
    try {
        const response = await fetch(`${BASE_URL}/api/jobs/getByHash/${hash}`);
        if (!response.ok) throw new Error('Erro ao buscar vaga');

        const job = await response.json();
        populateEditForm(job);
    } catch (error) {
        console.error('Erro ao buscar vaga:', error);
    }
});

// Função para preencher o formulário de edição
const populateEditForm = (job) => {
    toggleJobForm('post-edit-job-form', false);
    document.getElementById('edit-company-name').value = job.companyName;
    document.getElementById('edit-job-name').value = job.jobName;
    document.getElementById('edit-create-cidade').value = job.cidade;
    document.getElementById('edit-description').value = job.description;
    document.getElementById('edit-valor').value = job.valor;
    document.getElementById('edit-contato').value = job.contato;
};

// Evento para excluir a vaga
document.getElementById('edit-del-job-button').addEventListener('click', async () => {
    const hash = document.getElementById('edit-hash').value;
    if (!hash) {
        alert("Hash não fornecida. Não é possível excluir a vaga.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/jobs/delete/${hash}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir vaga');

        const result = await response.json();
        alert(result.message);
        toggleJobForm('post-edit-job-form', true);
        fetchAndDisplayJobs();
    } catch (error) {
        console.error('Erro ao excluir vaga:', error);
    }
});

// Evento para salvar a edição da vaga
document.getElementById('edit-save-job-button').addEventListener('click', async () => {
    const hash = document.getElementById('edit-hash').value;
    const jobData = gatherJobDataForEdit();

    try {
        const response = await fetch(`${BASE_URL}/api/jobs/edit/${hash}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobData),
        });

        if (!response.ok) throw new Error('Erro ao salvar a edição da vaga');

        const result = await response.json();
        alert(result.message);
        toggleJobForm('post-edit-job-form', true);
        fetchAndDisplayJobs();
    } catch (error) {
        console.error('Erro ao salvar a edição da vaga:', error);
    }
});

// Função para coletar dados do formulário de edição
const gatherJobDataForEdit = () => {
    const companyName = document.getElementById('edit-company-name').value;
    const jobName = document.getElementById('edit-job-name').value;
    const cidade = document.getElementById('edit-create-cidade').value;
    const description = document.getElementById('edit-description').value;
    const valor = document.getElementById('edit-valor').value;
    const contato = document.getElementById('edit-contato').value;

    return { companyName, jobName, cidade, description, valor, contato };
};
// Evento para buscar vagas por cidade
document.getElementById('search-button').addEventListener('click', async () => {
    const cidade = document.getElementById('cidade').value;
    if (!cidade) {
        alert("Por favor, insira uma cidade.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/jobs/getByCity/${cidade}`);
        if (!response.ok) throw new Error('Erro ao buscar vagas');

        const jobs = await response.json();
        displayJobs(jobs);
    } catch (error) {
        console.error('Erro ao buscar vagas:', error);
    }
});

// Função para exibir os trabalhos na cards-container
const displayJobs = (jobs) => {
    const cardsContainer = document.querySelector('.cards-container');
    cardsContainer.innerHTML = ''; // Limpa os cartões existentes

    if (jobs.length === 0) {
        cardsContainer.innerHTML = '<p>Nenhuma vaga encontrada para esta cidade.</p>';
        return;
    }

    jobs.forEach(job => createJobCard(job, cardsContainer));
};

// Chama a função para buscar e exibir vagas ao carregar a página
window.onload = fetchAndDisplayJobs;
