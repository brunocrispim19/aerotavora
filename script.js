// Ano atual no Footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Menu Mobile Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('menu-icon-open');
const iconClose = document.getElementById('menu-icon-close');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden');
    iconClose.classList.toggle('hidden');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
    });
});

// Cronômetro e altitude animados no HUD
let seconds = 868;
setInterval(() => {
    seconds++;
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    const timerEl = document.getElementById('hud-timer');
    if (timerEl) timerEl.textContent = `${hrs}:${mins}:${secs}`;

    const altEl = document.getElementById('hud-alt');
    if (altEl) {
        const alt = (85 + Math.sin(seconds * 0.4) * 1.4).toFixed(1);
        altEl.textContent = `${alt}m`;
    }
}, 1000);

// Filtros do Portfólio
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            if (filterValue === 'todos' || itemCategory === filterValue) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// Modal de Pré-visualização do Portfólio
let currentModalCategory = '';
function abrirModalProjeto(title, category, desc, imgUrl) {
    currentModalCategory = category;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-category').textContent = category;
    document.getElementById('modal-desc').textContent = desc;
    document.getElementById('modal-img').src = imgUrl;
    
    const modal = document.getElementById('project-modal');
    modal.style.display = 'flex';
}

function fecharModalProjeto() {
    const modal = document.getElementById('project-modal');
    modal.style.display = 'none';
}

function solicitarSemelhante() {
    fecharModalProjeto();
    if (currentModalCategory.includes('Comércio')) {
        selecionarServicoOrcamento('Localização de Mercado / Shopping / Loja');
    } else if (currentModalCategory.includes('Esportivos')) {
        selecionarServicoOrcamento('Evento Esportivo (Corrida / Ciclismo / Torneio)');
    } else {
        selecionarServicoOrcamento('Evento Esportivo / Corporativo / Social');
    }
}

document.getElementById('project-modal').addEventListener('click', (e) => {
    if (e.target.id === 'project-modal') {
        fecharModalProjeto();
    }
});

// Integração entre Cards de Serviço e Formulário de Orçamento
function selecionarServicoOrcamento(servicoNome) {
    const select = document.getElementById('servico');
    select.value = servicoNome;
    atualizarPreviaMensagem();
    document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
    showToast(`Serviço "${servicoNome}" selecionado!`);
}

// Gerador Dinâmico da Mensagem para WhatsApp
const nomeInput = document.getElementById('nome');
const servicoInput = document.getElementById('servico');
const dataInput = document.getElementById('data');
const localInput = document.getElementById('local');
const detalhesInput = document.getElementById('detalhes');
const previewEl = document.getElementById('message-preview');

function construirMensagemWhatsApp() {
    const nome = nomeInput.value.trim() || '[Seu Nome ou Empresa]';
    const servico = servicoInput.value;
    const local = localInput.value.trim() || '[Cidade / Bairro]';
    
    let dataFormatada = 'A combinar';
    if (dataInput.value) {
        const partes = dataInput.value.split('-');
        dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    const detalhes = detalhesInput.value.trim() || 'Gostaria de consultar valores e datas disponíveis.';

    return `Olá, equipe *Aero Távora*! Tudo bem?\n` +
           `Gostaria de solicitar um orçamento de filmagem com drone:\n\n` +
           `• *Nome/Empresa:* ${nome}\n` +
           `• *Projeto:* ${servico}\n` +
           `• *Local:* ${local}\n` +
           `• *Data prevista:* ${dataFormatada}\n` +
           `• *Observações:* ${detalhes}`;
}

function atualizarPreviaMensagem() {
    previewEl.textContent = construirMensagemWhatsApp();
}

[nomeInput, servicoInput, dataInput, localInput, detalhesInput].forEach(el => {
    el.addEventListener('input', atualizarPreviaMensagem);
    el.addEventListener('change', atualizarPreviaMensagem);
});

atualizarPreviaMensagem();

function copiarMensagem() {
    const texto = construirMensagemWhatsApp();
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = texto;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    try {
        document.execCommand('copy');
        showToast('Mensagem copiada para a área de transferência!');
    } catch (err) {
        showToast('Não foi possível copiar automaticamente.');
    }
    document.body.removeChild(tempTextarea);
}

function copiarArrobaInstagram() {
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = '@aerotavora';
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    try {
        document.execCommand('copy');
        showToast('@aerotavora copiado! Cole na busca do Instagram.');
    } catch (err) {
        showToast('Não foi possível copiar automaticamente.');
    }
    document.body.removeChild(tempTextarea);
}

let toastTimeout;
function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.style.display = 'flex';
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.style.display = 'none';
    }, 3500);
}

document.getElementById('quote-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const mensagem = encodeURIComponent(construirMensagemWhatsApp());
    // Substitua 5500000000000 pelo número oficial do WhatsApp da Aero Távora com DDI e DDD
    const whatsappUrl = `https://wa.me/5521966828821?text=${mensagem}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    showToast('Abrindo WhatsApp com seu orçamento...');
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));
