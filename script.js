// CÓDIGO ATUALIZADO E COMPLETO PARA: script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('municipio-form');
    const btnVoltar = document.getElementById('btn-voltar');

    // --- LÓGICA DE VERIFICAÇÃO ATUALIZADA ---
    // 1. Descobre qual questionário está sendo acessado pela URL
    const urlParams = new URLSearchParams(window.location.search);
    const questionarioId = urlParams.get('q');

    // 2. Define qual "chave" de memória verificar baseado no ID do questionário
    let chaveLocalStorage = '';
    if (questionarioId === '1') {
        chaveLocalStorage = 'emailParticipanteQ1';
    } else if (questionarioId === '2') {
        chaveLocalStorage = 'emailParticipanteQ2';
    }

    // 3. Verifica se já existe um email salvo para ESSE questionário específico
    if (chaveLocalStorage) {
        const emailSalvo = localStorage.getItem(chaveLocalStorage);
        if (emailSalvo) {
            // Se existir, bloqueia o formulário e avisa o usuário
            const formContainer = document.querySelector('.form-container');
            formContainer.innerHTML = `
                <div class="alert alert-success" style="text-align: center;">
                    <i class="fas fa-check-circle"></i> 
                    <strong>Obrigado por participar!</strong>
                    <p style="margin-top: 10px;">Verificamos que o email <strong>${emailSalvo}</strong> já completou este questionário neste navegador.</p>
                    <button onclick="window.location.href='index.html'" class="btn btn-primary" style="margin-top: 20px;">
                        Voltar ao Início
                    </button>
                </div>
            `;
            return; // Impede o resto do script de ser executado
        }
    }
    // --- FIM DA LÓGICA DE VERIFICAÇÃO ---


    btnVoltar.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (this.checkValidity()) {
            const nome = encodeURIComponent(document.getElementById('nome').value);
            const cpf = encodeURIComponent(document.getElementById('cpf').value);
            const email = encodeURIComponent(document.getElementById('email').value);
            const cidade = encodeURIComponent(document.getElementById('municipio').value);
            const estado = encodeURIComponent(document.getElementById('estado').value);
            const van = encodeURIComponent(document.getElementById('van').value);

            let proximaPagina = questionarioId === '2' ? 'questionario2.html' : 'questionario1.html';
            
            proximaPagina += `?nome=${nome}&cpf=${cpf}&email=${email}&cidade=${cidade}&estado=${estado}&van=${van}`;
            
            window.location.href = proximaPagina;

        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
            this.reportValidity();
        }
    });
});
