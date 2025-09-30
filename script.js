document.addEventListener('DOMContentLoaded', function() {
    // Scroll suave para links de navegação
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            let targetId = this.getAttribute('href');
            let targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Considera a altura do cabeçalho fixo
                let headerOffset = document.querySelector('.main-header').offsetHeight;
                let elementPosition = targetElement.getBoundingClientRect().top;
                let offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});