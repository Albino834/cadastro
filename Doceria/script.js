const form = document.getElementById('empresaForm');
const cnpjInput = document.getElementById('cnpj');
const foneInput = document.getElementById('fone');
const mensagem = document.getElementById('mensagem');

function somenteNumeros(valor) {
    return valor.replace(/\D/g, '');
}

function formatarCnpj(valor) {
    return somenteNumeros(valor).slice(0, 14)
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
}

function formatarTelefone(valor) {
    const numeros = somenteNumeros(valor).slice(0, 11);
    if (numeros.length > 10) {
        return numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    return numeros.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
}

function calcularDigito(base) {
    let soma = 0;
    let peso = base.length - 7;

    for (let i = 0; i < base.length; i += 1) {
        soma += Number(base[i]) * peso;
        peso -= 1;
        if (peso < 2) peso = 9;
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
}

function validarCnpj(valor) {
    const cnpj = somenteNumeros(valor);

    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }

    const primeiro = calcularDigito(cnpj.slice(0, 12));
    const segundo = calcularDigito(cnpj.slice(0, 12) + primeiro);
    return cnpj === cnpj.slice(0, 12) + primeiro + segundo;
}

function mostrarErro(id, texto) {
    const campo = document.getElementById(id);
    const erro = document.getElementById(`erro${id.charAt(0).toUpperCase()}${id.slice(1)}`);
    campo.classList.toggle('invalido', Boolean(texto));
    erro.textContent = texto;
}

cnpjInput.addEventListener('input', () => {
    cnpjInput.value = formatarCnpj(cnpjInput.value);
});

foneInput.addEventListener('input', () => {
    foneInput.value = formatarTelefone(foneInput.value);
});

form.addEventListener('submit', event => {
    event.preventDefault();
    mensagem.textContent = '';

    const campos = [
        ['nomeEmpresa', 'Informe o nome da empresa.'],
        ['endereco', 'Informe o endereço.'],
        ['fone', 'Informe o fone de contato.'],
        ['responsavel', 'Informe o nome do responsável.']
    ];

    let valido = true;
    campos.forEach(([id, texto]) => {
        const erro = document.getElementById(id).value.trim() ? '' : texto;
        mostrarErro(id, erro);
        if (erro) valido = false;
    });

    const erroCnpj = validarCnpj(cnpjInput.value) ? '' : 'Informe um CNPJ válido.';
    mostrarErro('cnpj', erroCnpj);
    if (erroCnpj) valido = false;

    if (!valido) {
        mensagem.textContent = 'Corrija os campos destacados.';
        mensagem.style.color = '#c0392b';
        return;
    }

    mensagem.textContent = 'Cadastro validado com sucesso.';
    mensagem.style.color = '#287548';
});

form.addEventListener('reset', () => {
    window.setTimeout(() => {
        document.querySelectorAll('.invalido').forEach(campo => campo.classList.remove('invalido'));
        document.querySelectorAll('small').forEach(erro => erro.textContent = '');
        mensagem.textContent = '';
    }, 0);
});
