document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('municipio-form');
    const btnVoltar = document.getElementById('btn-voltar');

    // Função do botão "Voltar"
    btnVoltar.addEventListener('click', () => {
        // Redireciona para a página inicial (mais previsível que voltar no histórico)
        window.location.href = 'index.html'; 
    });

    // Função do botão "Continuar" (ao submeter o formulário)
    form.addEventListener('submit', function(event) {
        // Impede o envio padrão do formulário
        event.preventDefault();

        // Verifica se todos os campos obrigatórios foram preenchidos
        if (this.checkValidity()) {
            // Coleta os dados dos campos
            const nome = encodeURIComponent(document.getElementById('nome').value);
            const cpf = encodeURIComponent(document.getElementById('cpf').value);
            const cidade = encodeURIComponent(document.getElementById('municipio').value);
            const estado = encodeURIComponent(document.getElementById('estado').value);
            const van = encodeURIComponent(document.getElementById('van').value);

            // Lógica para decidir para qual questionário ir
            const urlParams = new URLSearchParams(window.location.search);
            const questionarioId = urlParams.get('q');
            let proximaPagina = questionarioId === '2' ? 'questionario2.html' : 'questionario1.html';
            
            // Monta a URL final com os dados e redireciona o usuário
            proximaPagina += `?nome=${nome}&cpf=${cpf}&cidade=${cidade}&estado=${estado}&van=${van}`;
            window.location.href = proximaPagina;

        } else {
            // Se algum campo estiver faltando, avisa o usuário
            alert('Por favor, preencha todos os campos obrigatórios.');
            this.reportValidity(); // Mostra visualmente quais campos faltam
        }
    });
});
