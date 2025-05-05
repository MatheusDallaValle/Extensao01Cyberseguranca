const input = document.getElementById('fname');
const containerRequisitos = document.getElementById('requisitos');

// Lista de regras com validações e descrições
const regras = [
    {
        descricao: 'A senha deve ter no mínimo 12 caracteres',
        validar: (senha) => senha.length >= 12
    },
    {
        descricao: 'Deve conter pelo menos uma letra maiúscula',
        validar: (senha) => /[A-Z]/.test(senha)
    },
    {
        descricao: 'Deve conter pelo menos uma letra minúscula',
        validar: (senha) => /[a-z]/.test(senha)
    },
    {
        descricao: 'Deve conter pelo menos um número',
        validar: (senha) => /\d/.test(senha)
    },
    {
        descricao: 'Deve conter pelo menos um caractere especial (!@#$...)',
        validar: (senha) => /[!@#$%^&*()_+\-=[\]{}|;:'",.<>/?`~]/.test(senha)
    },
    {
        descricao: 'Não pode conter espaços em branco',
        validar: (senha) => !/\s/.test(senha)
    },
    {
        descricao: 'Não pode conter sequências como "123" ou "abc"',
        validar: (senha) => {
            const sequencias = ['123', '234', '345', 'abc', 'bcd', 'cde'];
            const senhaLower = senha.toLowerCase();
            return !sequencias.some(seq => senhaLower.includes(seq));
        }
    },
    {
        descricao: 'Deve conter pelo menos 4 tipos de caracteres diferentes (maiúsculas, minúsculas, números, símbolos)',
        validar: (senha) => {
            let tipos = 0;
            if (/[A-Z]/.test(senha)) tipos++;
            if (/[a-z]/.test(senha)) tipos++;
            if (/\d/.test(senha)) tipos++;
            if (/[!@#$%^&*()_+\-=[\]{}|;:'",.<>/?`~]/.test(senha)) tipos++;
            return tipos >= 4;
        }
    },
    {
        descricao: 'A soma dos números (arábicos) deve ser igual a 20',
        validar: (senha) => {
            const digitos = senha.match(/\d/g);
            if (!digitos) return false;
            const soma = digitos.map(Number).reduce((a, b) => a + b, 0);
            return soma === 20;
        }
    },
    {
        descricao: 'Deve conter pelo menos um número romano em maiúsculo (I, V, X, L, C, D, M)',
        validar: (senha) => /[IVXLCDM]/.test(senha)
    },
    {
        descricao: 'A soma dos números romanos maiúsculos deve ser igual a 25',
        validar: (senha) => {
            const valoresRomanos = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
            let soma = 0;
            for (let char of senha) {
                if (valoresRomanos[char]) {
                    soma += valoresRomanos[char];
                }
            }
            return soma === 25;
        }
    }
];

let elementosRegras = [];
let totalVisiveis = 1;

// Cria dinamicamente o elemento de regra na tela
function criarElementoRegra(regra, index) {
    const div = document.createElement('div');
    div.classList.add('d-flex', 'align-items-center', 'gap-2');
    div.id = `regra-${index}`;

    const p = document.createElement('p');
    p.textContent = regra.descricao;

    const img = document.createElement('img');
    img.src = 'img/errado.svg';
    img.alt = 'Status';
    img.width = 20;

    div.appendChild(p);
    div.appendChild(img);
    containerRequisitos.appendChild(div);

    return { elemento: div, img: img };
}

// Inicializa a primeira regra
for (let i = 0; i < totalVisiveis; i++) {
    const el = criarElementoRegra(regras[i], i);
    elementosRegras.push(el);
}

// Verifica todas as regras visíveis
const verificarSenha = () => {
    const senha = input.value;
    let liberarProxima = true;

    for (let i = 0; i < totalVisiveis; i++) {
        const regra = regras[i];
        const valido = regra.validar(senha);

        const img = elementosRegras[i].img;
        img.src = valido ? 'img/correto.svg' : 'img/errado.svg';
        img.alt = valido ? 'Correto' : 'Errado';

        if (!valido) {
            liberarProxima = false;
        }
    }

    // Adiciona próxima regra se todas as anteriores estiverem corretas
    if (liberarProxima && totalVisiveis < regras.length) {
        const novaRegra = criarElementoRegra(regras[totalVisiveis], totalVisiveis);
        elementosRegras.push(novaRegra);
        totalVisiveis++;
    }

    // Finaliza se todas forem cumpridas
    const todasCumpridas = totalVisiveis === regras.length &&
        elementosRegras.every((_, i) => regras[i].validar(senha));

    if (todasCumpridas && !document.getElementById('mensagem-final')) {
        const msg = document.createElement('p');
        msg.id = 'mensagem-final';
        msg.classList.add('mt-3', 'text-success', 'fw-bold');
        msg.textContent = '🎉 Parabéns! Você criou uma senha segura!';
        containerRequisitos.appendChild(msg);
        input.disabled = true;
    }
};

// Verificação contínua a cada 500ms
setInterval(verificarSenha, 500);
