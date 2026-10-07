const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

window.addEventListener('load', () => {
  setTimeout(() => $('#loader')?.classList.add('done'), 650);
});

const menuBtn = $('#menuBtn');
const mainNav = $('#mainNav');
menuBtn?.addEventListener('click', () => mainNav.classList.toggle('open'));
$$('nav a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
$$('.reveal').forEach(el => observer.observe(el));

function phoneMask(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g,'').slice(0,11);
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    input.value = v;
  });
}
$$('.phone').forEach(phoneMask);

function showToast(msg) {
  const toast = $('#toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

const modal = $('#modal');
const modalTitle = $('#modalTitle');
const modalText = $('#modalText');
const modalIcon = $('#modalIcon');
const registerType = $('#registerType');
const vehicleField = $('#vehicleField');

$$('[data-open-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.openModal;
    const driver = type === 'motorista';
    registerType.value = type;
    modalIcon.textContent = driver ? '🚚' : '👤';
    modalTitle.textContent = driver ? 'Cadastro de motorista' : 'Cadastro de cliente';
    modalText.textContent = driver
      ? 'Deixe seus dados para apresentar seu perfil como motorista parceiro.'
      : 'Salve seus dados neste dispositivo para agilizar seu próximo contato.';
    vehicleField.classList.toggle('hidden', !driver);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});
$$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

$('#registerForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const key = data.tipo === 'motorista' ? 'ac_motoristas' : 'ac_clientes';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  list.push({...data, criadoEm: new Date().toISOString()});
  localStorage.setItem(key, JSON.stringify(list));
  closeModal();
  e.target.reset();
  showToast('Cadastro salvo neste dispositivo com sucesso.');
});

$('#quoteForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const msg =
`Olá, AC Transporte! Gostaria de solicitar um orçamento.

*Nome:* ${data.nome}
*Telefone:* ${data.telefone}
*Origem:* ${data.origem}
*Destino:* ${data.destino}
*Serviço:* ${data.servico}
*Veículo:* ${data.veiculo}
*Detalhes da carga:* ${data.detalhes || 'Não informado'}`;

  window.open('https://wa.me/5511961566639?text=' + encodeURIComponent(msg), '_blank');
  showToast('Solicitação preparada para o WhatsApp.');
});

const header = $('#header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, {passive:true});

// Pequeno efeito de movimento no hero para telas com mouse.
const visual = $('.hero-visual');
if (visual && matchMedia('(pointer:fine)').matches) {
  visual.addEventListener('mousemove', e => {
    const r = visual.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    const card = $('.truck-card');
    card.style.transform = `perspective(800px) rotateY(${x*5}deg) rotateX(${-y*4}deg)`;
  });
  visual.addEventListener('mouseleave', () => $('.truck-card').style.transform = '');
}
