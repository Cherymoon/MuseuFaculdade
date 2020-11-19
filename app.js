let formGroup = new Map();
let currentId = 0;
let obras = [];

const textoErros = () => {
  let mapErros = new Map();
  mapErros.set("nmObra", "O nome da obra deve ter ao menos 6 caracteres.");
  mapErros.set("nmAutor", "O nome do autor deve ter ao menos 10 caracteres.");
  mapErros.set("nrAnoObra", "Ano inválido.");
  mapErros.set("dsPeriodoObra", "Selecione um período");
  mapErros.set("dsTipoObra", "Selecione um tipo.");
  return mapErros;
};

const textosPeriodo = () => {
  let textos = new Map();
  textos.set("antesCristo", "a.C.");
  textos.set("depoisCristo", "d.C.");
  return textos;
};

const textosTipo = () => {
  let textos = new Map();
  textos.set("quadro", "Quadro");
  textos.set("escultura", "Escultura");
  textos.set("outro", "Outro");
  return textos;
};

let definirFormulario = () => {
  formGroup.set("nmObra", document.getElementById("nmObra")?.value);
  formGroup.set("nmAutor", document.getElementById("nmAutor")?.value);
  formGroup.set("nrAnoObra", document.getElementById("nrAnoObra")?.value);
  formGroup.set(
    "dsPeriodoObra",
    document.getElementById("dsPeriodoObra")?.value
  );
  formGroup.set("dsTipoObra", document.getElementById("dsTipoObra")?.value);
  formGroup.set("dsDetalhes", document.getElementById("dsDetalhes")?.value);
};

let limparFormulario = () => {
  document.getElementById("nmObra").value = "";
  document.getElementById("nmAutor").value = "";
  document.getElementById("nrAnoObra").value = "";
  document.getElementById("dsPeriodoObra").value = "vazio";
  document.getElementById("dsTipoObra").value = "vazio";
  document.getElementById("dsDetalhes").value = "";
};

let obterFormulario = () => {
  definirFormulario();
  return formGroup;
};

let validarFormulario = () => {
  let listaErros = [];

  obterFormulario().forEach((p, k) => {
    if (k === "nmObra" && (isNil(p) || p.length < 6)) listaErros.push(k);
    else if (k === "nmAutor" && (isNil(p) || p.length < 10)) listaErros.push(k);
    else if (k === "nrAnoObra" && !isAnoValido(p)) listaErros.push(k);
    else if (k === "dsPeriodoObra" && p === "vazio") listaErros.push(k);
    else if (k === "dsTipoObra" && p === "vazio") listaErros.push(k);
  });

  return listaErros;
};

let isAnoValido = (ano) => {
  if (
    isNil(ano) ||
    !Number.isInteger(Number(ano)) ||
    ano.toString().length > 4 ||
    ano > new Date().getFullYear()
  ) {
    return false;
  }
  return true;
};

let isNil = (texto) => {
  return texto === null || texto === undefined || texto.trim() === "";
};

let limparListaErros = () => {
  document.getElementById("erros").innerHTML = "";
};

let addBordaErros = (erros) => {
  erros.forEach((p) => {
    document.getElementById(p).classList.add("border-red");
  });
};

let removeBordaErros = (event) => {
  document.getElementById(event.target.id).classList.remove("border-red");
};

let exibirErros = (erros) => {
  let textoErro = textoErros();
  erros.forEach((p) => {
    var node = document.createElement("li");
    var textnode = document.createTextNode(textoErro.get(p));
    node.appendChild(textnode);
    document.getElementById("erros").appendChild(node);
  });
  addBordaErros(erros);
};

let newObra = () => {
  let obra = {
    id: ++currentId,
    nmObra: formGroup.get("nmObra"),
    nmAutor: formGroup.get("nmAutor"),
    nrAnoObra: formGroup.get("nrAnoObra"),
    dsPeriodoObra: formGroup.get("dsPeriodoObra"),
    dsTipoObra: formGroup.get("dsTipoObra"),
    dsDetalhes: formGroup.get("dsDetalhes"),
  };
  return obra;
};

let enviarForm = () => {
  let erros = validarFormulario();
  limparListaErros();
  if (erros.length) exibirErros(erros);
  else {
    addNovaObra();
    updateTabela();
    limparFormulario();
  }
};

let addNovaObra = () => {
  let novaObra = newObra();
  obras.push(novaObra);
  document.getElementById("tabela").classList.remove("hidden");
};

let limparTabela = () => {
  document.getElementById("t-body").innerHTML = "";
};

let updateTabela = () => {
  limparTabela();
  obras.forEach((p) => {
    var nodeRow = document.createElement("tr");
    nodeRow.id = `obra-${p.id}`;
    nodeRow.className = "obraRow";

    var nodeDataNome = document.createElement("td");
    var nodeDataAutor = document.createElement("td");
    var nodeDataAno = document.createElement("td");
    var nodeDataPeriodo = document.createElement("td");
    var nodeDataTipo = document.createElement("td");
    var nodeDataExcluir = document.createElement("td");
    var nodeSpanExcluir = document.createElement("span");

    var nodeTextoNome = document.createTextNode(p.nmObra);
    var nodeTextoAutor = document.createTextNode(p.nmAutor);
    var nodeTextoAno = document.createTextNode(p.nrAnoObra);
    var nodeTextoPeriodo = document.createTextNode(
      textosPeriodo().get(p.dsPeriodoObra)
    );
    var nodeTextoTipo = document.createTextNode(textosTipo().get(p.dsTipoObra));
    var nodeTextoExcluir = document.createTextNode("x");

    nodeSpanExcluir.id = `excluir-${p.id}`;
    nodeSpanExcluir.className = "excluirRow";

    nodeSpanExcluir.appendChild(nodeTextoExcluir);

    nodeDataNome.appendChild(nodeTextoNome);
    nodeDataAutor.appendChild(nodeTextoAutor);
    nodeDataAno.appendChild(nodeTextoAno);
    nodeDataPeriodo.appendChild(nodeTextoPeriodo);
    nodeDataTipo.appendChild(nodeTextoTipo);
    nodeDataExcluir.appendChild(nodeSpanExcluir);

    nodeRow.appendChild(nodeDataNome);
    nodeRow.appendChild(nodeDataAutor);
    nodeRow.appendChild(nodeDataAno);
    nodeRow.appendChild(nodeDataPeriodo);
    nodeRow.appendChild(nodeDataTipo);
    nodeRow.appendChild(nodeDataExcluir);

    document.getElementById("t-body").appendChild(nodeRow);
  });
  setOnRowClick();
  setOnExcluirClick();
};

let setOnRowClick = () => {
  document.querySelectorAll(".obraRow").forEach((p) =>
    p.addEventListener("click", function () {
      let idObraInt = parseInt(p.id.replace("obra-", ""));
      showDetalhe(idObraInt);
    })
  );
};

let setOnExcluirClick = () => {
  document.querySelectorAll(".excluirRow").forEach((p) =>
    p.addEventListener("click", function () {
      let idObraInt = parseInt(p.id.replace("excluir-", ""));
      let nmObra = obras.find(o => o.id === idObraInt).nmObra;
      var confirm = prompt(
        `Deseja realmente excluir a obra ${nmObra}? (Sim ou Não)`
      );
      if (!isNil(confirm) && confirm.trim().toLowerCase() === "sim") {
        
        let posObra = obras.findIndex((p) => p.id === idObraInt);
        excluirItemTabela(posObra);
      }
    })
  );
};

let excluirItemTabela = (id) => {
  obras.splice(id, 1);
  updateTabela();
  hideTabela();
};

let hideTabela = () => {
  let sizeTabela = obras.length;
  hideDetalhes();
  if (obras.length < 1) {
    document.getElementById("tabela").classList.remove("hidden");
    document.getElementById("tabela").classList.add("hidden");
  }
};

let hideDetalhes = () => {
  document.getElementById("detalhamento").classList.remove("hidden");
  document.getElementById("detalhamento").classList.add("hidden");
};

let showDetalhe = (id) => {
  let obra = obras.find((p) => p.id === id);
  if (obra != undefined && obra != null) {
    let detalheObra = obra.dsDetalhes;
    document.getElementById("detalhe-text").innerHTML = detalheObra;
    document.getElementById("detalhamento").classList.remove("hidden");
  }
};

definirFormulario();
