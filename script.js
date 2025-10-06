// CÓDIGO COMPLETO E ATUALIZADO PARA: script.js

document.addEventListener('DOMContentLoaded', () => {
    // COLE AQUI A URL DO SEU WEB APP DO GOOGLE SHEETS
    const WEB_APP_URL = 'COLE_A_URL_AQUI';

    const form = document.getElementById('municipio-form');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnSubmit = form.querySelector('button[type="submit"]');

    btnVoltar.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // A função de submit agora é 'async' para poder aguardar a verificação
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // 1. Validação básica dos campos
        if (!this.checkValidity()) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            this.reportValidity();
            return;
        }

        // Desabilita o botão e mostra "Verificando..."
        const originalButtonText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = 'Verificando... <i class="fas fa-spinner fa-spin"></i>';

        // 2. Coleta dos dados para verificação e para o próximo passo
        const cpf = document.getElementById('cpf').value;
        const urlParams = new URLSearchParams(window.location.search);
        const questionarioId = urlParams.get('q');
        
        try {
            // 3. Faz a chamada ao Google Sheets para verificar o CPF
            const response = await fetch(`${WEB_APP_URL}?cpf=${cpf}&quizId=${questionarioId}`);
            const result = await response.json();

            // 4. Analisa a resposta da planilha
            if (result.status === 'found') {
                // Se o CPF foi encontrado, avisa o usuário e para o processo
                alert('Este CPF já respondeu a este questionário. Obrigado!');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalButtonText;
                return;
            }
            
            // 5. Se o CPF não foi encontrado, redireciona para o questionário
            if (result.status === 'not_found') {
                const nome = encodeURIComponent(document.getElementById('nome').value);
                const email = encodeURIComponent(document.getElementById('email').value);
                const cidade = encodeURIComponent(document.getElementById('municipio').value);
                const estado = encodeURIComponent(document.getElementById('estado').value);
                const van = encodeURIComponent(document.getElementById('van').value);

                let proximaPagina = questionarioId === '2' ? 'questionario2.html' : 'questionario1.html';
                proximaPagina += `?nome=${nome}&cpf=${cpf}&email=${email}&cidade=${cidade}&estado=${estado}&van=${van}`;
                
                window.location.href = proximaPagina;
            } else {
                // Se houve algum erro na verificação, avisa no console mas permite continuar
                console.error('Erro na verificação, mas permitindo o usuário continuar:', result.message);
                // (Opcional) Você pode decidir bloquear o usuário aqui também
                alert('Ocorreu um erro ao verificar os dados. Tente novamente.');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalButtonText;
            }

        } catch (error) {
            console.error('Erro de rede ao tentar verificar o CPF:', error);
            alert('Não foi possível conectar ao servidor para verificação. Verifique sua conexão e tente novamente.');
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalButtonText;
        }
    });
});
