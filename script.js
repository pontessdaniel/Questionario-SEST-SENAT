// VERSÃO SIMPLIFICADA - APENAS VALIDA E REDIRECIONA

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('municipio-form');
    const btnVoltar = document.getElementById('btn-voltar');

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

            const urlParams = new URLSearchParams(window.location.search);
            const questionarioId = urlParams.get('q');
            let proximaPagina = questionarioId === '2' ? 'questionario2.html' : 'questionario1.html';
            
            proximaPagina += `?nome=${nome}&cpf=${cpf}&email=${email}&cidade=${cidade}&estado=${estado}&van=${van}`;
            
            window.location.href = proximaPagina;
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
            this.reportValidity();
        }
    });
});
