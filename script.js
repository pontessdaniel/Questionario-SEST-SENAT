// VERSÃO FINAL COM JSONP

document.addEventListener('DOMContentLoaded', () => {
    const WEB_APP_URL = 'https://script.google.com/a/macros/onsv.org.br/s/AKfycbxoYs_PGBuofxe3JiQ-UOkQWvnOLlh8EmwTL769pmOsGP-O7UdZoWM0dvlqLnguh2dsvQ/exec'; // Sua URL /exec

    const form = document.getElementById('municipio-form');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnSubmit = form.querySelector('button[type="submit"]');

    btnVoltar.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    form.addEventListener('submit', function(event) {
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
        
        // --- LÓGICA JSONP ---
        const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        
        // Cria uma função global temporária para receber a resposta
        window[callbackName] = function(data) {
            // Limpeza: remove o script e a função global
            document.body.removeChild(script);
            delete window[callbackName];

            // Analisa a resposta
            if (data.status === 'found') {
                alert('Este CPF já respondeu a este questionário. Obrigado!');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalButtonText;
                return;
            }

            if (data.status === 'not_found') {
                // Se não encontrou, prossegue para o questionário
                const nome = encodeURIComponent(document.getElementById('nome').value);
                const email = encodeURIComponent(document.getElementById('email').value);
                const cidade = encodeURIComponent(document.getElementById('municipio').value);
                const estado = encodeURIComponent(document.getElementById('estado').value);
                const van = encodeURIComponent(document.getElementById('van').value);

                let proximaPagina = questionarioId === '2' ? 'questionario2.html' : 'questionario1.html';
                proximaPagina += `?nome=${nome}&cpf=${cpf}&email=${email}&cidade=${cidade}&estado=${estado}&van=${van}`;
                
                window.location.href = proximaPagina;
            } else {
                alert('Ocorreu um erro na verificação: ' + data.message);
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalButtonText;
            }
        };

        // Cria a tag de script dinamicamente
        const script = document.createElement('script');
        script.src = `${WEB_APP_URL}?callback=${callbackName}&cpf=${cpf}&quizId=${questionarioId}`;
        
        // Adiciona um tratamento de erro para falhas de rede
        script.onerror = function() {
            alert('Não foi possível conectar ao servidor para verificação. Tente novamente.');
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalButtonText;
            document.body.removeChild(script);
            delete window[callbackName];
        };
        
        // Adiciona o script à página para iniciar a requisição
        document.body.appendChild(script);
    });
});
