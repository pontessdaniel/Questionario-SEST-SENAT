// CÓDIGO FINAL - FAZ A VERIFICAÇÃO E BLOQUEIA O USUÁRIO

document.addEventListener('DOMContentLoaded', () => {
    // COLE AQUI A URL DO SEU WEB APP DO GOOGLE SHEETS
    const WEB_APP_URL = 'https://script.google.com/a/macros/onsv.org.br/s/AKfycbxoYs_PGBuofxe3JiQ-UOkQWvnOLlh8EmwTL769pmOsGP-O7UdZoWM0dvlqLnguh2dsvQ/exec';

    const form = document.getElementById('municipio-form');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnSubmit = form.querySelector('button[type="submit"]');

    btnVoltar.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        if (!this.checkValidity()) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            this.reportValidity();
            return;
        }

        const originalButtonText = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = 'Verificando... <i class="fas fa-spinner fa-spin"></i>';

        const cpf = document.getElementById('cpf').value;
        const urlParams = new URLSearchParams(window.location.search);
        const questionarioId = urlParams.get('q');
        
        const verificationData = {
            action: 'verify_cpf',
            cpf: cpf,
            quizId: questionarioId
        };
        
        try {
            // Faz a chamada ao Google Sheets usando POST e esperando a resposta
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                // NÃO usamos mais 'no-cors'
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow',
                body: JSON.stringify(verificationData)
            });
            
            const result = await response.json();

            // Analisa a resposta e bloqueia se o CPF foi encontrado
            if (result.status === 'found') {
                alert('Este CPF já respondeu a este questionário. Obrigado!');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalButtonText;
                return; // PARA O PROCESSO AQUI
            }
            
            // Se o CPF não foi encontrado, redireciona para o questionário
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
                // Se deu um erro inesperado no script do Google
                throw new Error(result.message || 'Ocorreu um erro desconhecido na verificação.');
            }

        } catch (error) {
            console.error('Erro ao verificar o CPF:', error);
            alert('Não foi possível conectar ao servidor para verificação. Tente novamente.');
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalButtonText;
        }
    });
});
