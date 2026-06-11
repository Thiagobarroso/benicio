const API_URL =
'https://script.google.com/macros/s/AKfycbzLl-wLFc-5wUmTq5dEPzYg6gqV8UN8H4VTSJ94T9tbmpkYPVT83hDIxn5X7fyEYu3lGg/exec';

const telefone =
new URLSearchParams(
  window.location.search
).get('telefone');

async function iniciar() {

  const area =
    document.getElementById(
      'conteudo'
    );

  if (!telefone) {

    area.innerHTML =
      '<p>Link inválido.</p>';

    return;

  }

  const resposta =
    await fetch(
      `${API_URL}?telefone=${telefone}`
    );

  const familia =
    await resposta.json();

  if (!familia.length) {

    area.innerHTML =
      '<p>Pessoa não encontrada.</p>';

    return;

  }

  let html = `
    <div class="familia">
      <h2>${familia[0].familia}</h2>
    </div>
  `;

  familia.forEach(pessoa => {

    const confirmado =
      pessoa.confirmado === "SIM";

    html += `
      <div class="membro">

        <span>
          ${pessoa.nome}
        </span>

        <button
          class="status ${
            confirmado
              ? "sim"
              : "nao"
          }"

          onclick="trocarStatus(
            '${pessoa.nome}',
            this
          )">

          ${
            confirmado
              ? "🟢 Vou"
              : "🔴 Não Vou"
          }

        </button>

      </div>
    `;

  });

  html += `
    <div
      id="msg"
      class="msg">

      ✅ Presença atualizada

    </div>
  `;

  area.innerHTML = html;

}

async function trocarStatus(
  nome,
  botao
) {

  const confirmado =
    botao.classList.contains("sim")
      ? "NÃO"
      : "SIM";

  try {

    const resposta =
      await fetch(

`${API_URL}?acao=atualizar&nome=${encodeURIComponent(nome)}&confirmado=${confirmado}`

      );

    const resultado =
      await resposta.json();

    if (!resultado.sucesso) {

      alert(
        "Erro ao salvar."
      );

      return;

    }

    if (confirmado === "SIM") {

      botao.classList.remove("nao");
      botao.classList.add("sim");

      botao.innerHTML =
        "🟢 Vou";

    } else {

      botao.classList.remove("sim");
      botao.classList.add("nao");

      botao.innerHTML =
        "🔴 Não Vou";

    }

    const msg =
      document.getElementById(
        "msg"
      );

    msg.innerHTML =
      "✅ Presença atualizada";

    msg.style.display =
      "block";

    setTimeout(() => {

      msg.style.display =
        "none";

    }, 2500);

  } catch (erro) {

    console.error(erro);

    alert(
      "Erro ao atualizar presença"
    );

  }

}

iniciar();