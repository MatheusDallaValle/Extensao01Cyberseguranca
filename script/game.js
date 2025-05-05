const input = document.getElementById('fname');
const containerRequisitos = document.getElementById('requisitos');

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
            const sequencias = ['123', '234', '345', '456', '567', '678', '789', '012',
                                'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi'];
            const senhaLower = senha.toLowerCase();
            return !sequencias.some(seq => senhaLower.includes(seq));
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
    },
    {
        descricao: 'Sua senha deve incluir um símbolo de dois letras da tabela periódica (ex: He, Li, Na)',
        validar: (senha) => {
            const simbolos = [
                'He','Li','Be','Ne','Na','Mg','Al','Si','Cl','Ar',
                'Ca','Sc','Ti','Cr','Mn','Fe','Co','Ni','Cu','Zn',
                'Ga','Ge','As','Se','Br','Kr','Rb','Sr','Zr','Nb',
                'Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb',
                'Te','Xe','Cs','Ba','La','Ce','Pr','Nd','Pm','Sm',
                'Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu','Hf',
                'Ta','Re','Os','Ir','Pt','Au','Hg','Tl','Pb','Bi',
                'Po','At','Rn','Fr','Ra','Ac','Th','Pa','Np','Pu',
                'Am','Cm','Bk','Cf','Es','Fm','Md','No','Lr','Rf',
                'Db','Sg','Bh','Hs','Mt','Ds','Rg','Cn','Fl','Lv',
                'Ts','Og'
            ];
            return simbolos.some(simbolo => senha.includes(simbolo));
        }
    },
    {
        descricao: 'Sua senha deve conter um mês do ano por extenso (ex: janeiro, fevereiro...)',
        validar: (senha) => {
            const mesesCompletos = [
                'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
            ];
            const senhaLower = senha.toLowerCase();
            return mesesCompletos.some(mes => senhaLower.includes(mes));
        }
    }
];

let elementosRegras = [];
let totalVisiveis = 1;

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

for (let i = 0; i < totalVisiveis; i++) {
    const el = criarElementoRegra(regras[i], i);
    elementosRegras.push(el);
}

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

    if (liberarProxima && totalVisiveis < regras.length) {
        const novaRegra = criarElementoRegra(regras[totalVisiveis], totalVisiveis);
        elementosRegras.push(novaRegra);
        totalVisiveis++;
    }

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
