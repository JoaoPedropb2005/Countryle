# 🌍 Countryle (clone)

Jogo de adivinhação de países feito com **HTML**, **CSS** e **JavaScript**. O jogo seleciona um país aleatório (dados da REST Countries API) e, em até 6 tentativas, você deve descobrir qual é usando feedback sobre hemisfério, continente, população e distância/direção.

---

## ▶️ Como jogar
- Digite o nome de um país no campo (autocompletar disponível) e clique em **Chutar** ou pressione Enter.
- Você tem **6 tentativas** para acertar.
- Para cada palpite o jogo mostra:
  - **Hemisfério** (Norte/Sul) — correto/errado
  - **Continente** — corresponde ao continente do país alvo
  - **População** — cor (verde/amarelo/vermelho) ou indicação maior/menor
  - **Coordenadas** — distância aproximada em km + seta indicando a direção relativa
- Ao acertar, o input e o botão são desabilitados; ao zerar tentativas, o país correto é exibido.

---

## ⚙️ Tecnologias
- HTML, CSS, JavaScript (ES6)
- API: https://restcountries.com (consulta `name, region, population, latlng, translations`)

---

## 🚀 Executar localmente
Requisitos: navegador e conexão com a internet (consome API pública).

Opções:

1. Abrir diretamente
   - Abra `index.html` no navegador.

2. Usando Python (recomendado para evitar bloqueios de CORS em alguns ambientes)
   - `python3 -m http.server 8000`
   - Abra `http://localhost:8000`

3. Usando um servidor estático Node
   - `npx serve .` e abra o endereço exibido

---

## 📁 Estrutura do projeto
- `index.html` — marcação da UI
- `style.css` — estilos
- `script.js` — lógica do jogo (carrega países, calcula distância, gera feedback)
- `README.md` — documentação

---

## 🔧 Observações técnicas
- Os países são obtidos dinamicamente via `https://restcountries.com/v3.1/all?fields=name,region,population,latlng,translations`.
- O jogo usa a tradução em português (`translations.por.common`) quando disponível, caso contrário usa `name.common`.
- A distância é calculada pela fórmula de Haversine.
- O console do navegador registra o país sorteado (útil para testes).

---

## 🐞 Pontos conhecidos / Limitations
- Depende de uma API externa — funciona apenas com internet.
- Alguns países podem não ter `latlng` — termo de fallback necessário para casos raros.
- Normalização de nomes (acentos/variações) pode ser melhorada.
- Não há botão de "Novo jogo" nem persistência de pontuação.

---

## ✅ Melhorias sugeridas (PR bem-vindas)
- Adicionar botão "Novo jogo" / reiniciar automaticamente.
- Normalizar entradas do usuário (remover acentos, variações de nome).
- Tratar países sem `latlng` e exibir mensagem amigável.
- Melhorar acessibilidade (labels, foco, contrastes) e testes automatizados.

---

## 🤝 Contribuição
1. Fork e branch com feature/bugfix
2. Abra um Pull Request descrevendo a mudança

---

## 📝 Licença
MIT — sinta-se livre para usar e adaptar para fins educativos.
