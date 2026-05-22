const API_URL = "https://titan-diet-back-end.vercel.app/gerar-dieta";

const form = document.getElementById('diet-form');
const spinner = document.getElementById('loading-spinner');
const btnEnviar = document.getElementById('btn-enviar');
const resultadoContainer = document.getElementById('resultado-container');
const errorContainer = document.getElementById('error-message');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const objetivo = document.getElementById('objetivo').value.trim();
    const dia_livre = document.getElementById('dia_livre').value.trim() || "Nenhum";
    const detalhes = document.getElementById('detalhes').value.trim() || "Sem detalhes adicionais";

    errorContainer.classList.add('hidden');
    resultadoContainer.classList.add('hidden');
    spinner.classList.remove('hidden');
    btnEnviar.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ objetivo, dia_livre, detalhes })
        });

        const data = await response.json();

        if (data.status === "success") {
            exibirDieta(data.dieta);
        } else {
            mostrarErro(data.message || "Erro ao gerar a dieta.");
        }

    } catch (error) {
        mostrarErro("Falha na conexão com a API. Verifique se o backend está rodando em http://127.0.0.1:5000.");
    } finally {
        spinner.classList.add('hidden');
        btnEnviar.disabled = false;
    }
});

function exibirDieta(dieta) {
    document.getElementById('objetivo-identificado').innerText = dieta.objetivo_identificado;

    const mensagensDiv = document.getElementById('mensagens-barros');
    mensagensDiv.innerHTML = dieta.mensagens_do_barros.map(msg => `<p>"${msg}"</p>`).join('');

    const dietaContainer = document.getElementById('dieta-semanal');
    dietaContainer.innerHTML = "";

    dieta.dieta_semanal.forEach(diaData => {
        const card = document.createElement('div');
        card.className = 'card';
        
        let htmlContent = `<p class="text-gym-gold">${diaData.dia}</p>`;
        
        diaData.refeicoes.forEach(ref => {
            htmlContent += `
                <div class="refeicao-item">
                    <strong>${ref.refeicao}</strong>
                    <span>${ref.descricao}</span>
                </div>
            `;
        });

        card.innerHTML = htmlContent;
        dietaContainer.appendChild(card);
    });

    resultadoContainer.classList.remove('hidden');
    resultadoContainer.scrollIntoView({ behavior: 'smooth' });
}

function mostrarErro(mensagem) {
    errorContainer.innerText = mensagem;
    errorContainer.classList.remove('hidden');
}