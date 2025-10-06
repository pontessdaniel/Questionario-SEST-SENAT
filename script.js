// CÓDIGO ATUALIZADO COM MÉTODO POST PARA EVITAR CORS

document.addEventListener('DOMContentLoaded', () => {
    // COLE AQUI A URL DO SEU WEB APP DO GOOGLE SHEETS
    const WEB_APP_URL = 'COLE_A_URL_AQUI';

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
        
        // Prepara os dados para a verificação
        const verificationData = {
            action: 'verify',
            cpf: cpf,
            quizId: questionarioId
        };
        
        try {
            // Faz a chamada ao Google Sheets usando o método POST
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', // O no-cors é necessário para o Google Scripts, mas nos impede de ler a resposta diretamente.
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(verificationData)
            });

            // IMPORTANTE: Devido ao 'no-cors', não podemos ler a resposta de verificação.
            // O bloqueio do CPF agora precisa ser feito na planilha (ex: formatação condicional para destacar duplicados).
            // O código abaixo vai permitir que o usuário prossiga, mas a verificação acontecerá no lado do script.
            // Para uma verificação que bloqueie o usuário, seria necessário um setup de CORS mais avançado.
            // Por enquanto, vamos priorizar o envio dos dados.

            // A lógica original de verificação é comentada, pois o 'no-cors' impede a leitura da resposta.
            /*
            const result = await response.json();
            if (result.status === 'found') {
                alert('Este CPF já respondeu a este questionário. Obrigado!');
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalButtonText;
                return;
            }
            */

            // Se chegou aqui, redireciona para o questionário
            const nome = encodeURIComponent(document.getElementById('nome').value);
            const email = encodeURIComponent(document.getElementById('email').value);
            const cidade = encodeURIComponent(document.getElementById('municipio').value);
            const estado = encodeURIComponent(document.getElementById('estado').value);
            const van = encodeURIComponent(document.getElementById('van').value);

            let proximaPagina = questionarioId === '2' ? 'questionario2.html' : 'questionario1.html';
            proximaPagina += `?nome=${nome}&cpf=${cpf}&email=${email}&cidade=${cidade}&estado=${estado}&van=${van}`;
            
            window.location.href = proximaPagina;

        } catch (error) {
            console.error('Erro de rede ao tentar verificar o CPF:', error);
            alert('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = originalButtonText;
        }
    });
});
