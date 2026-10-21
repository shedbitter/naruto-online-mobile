# Naruto Online Mobile — Ruffle Lab

Uma prova técnica gratuita e mobile-first para experimentar conteúdo Flash obtido legalmente no Safari do iPhone. Usa Vite, TypeScript e o pacote web de Ruffle, sem servidor de jogo nem ativos de Naruto Online.

> **Estado:** o cliente original inglês de Naruto Online ainda não foi testado. Não há confirmação de que o jogo funcione em Ruffle, Safari ou iPhone.

## Executar localmente

Requer Node.js 22.12 ou superior e npm.

```sh
npm install
npm run dev
```

Abra o endereço apresentado pelo Vite. Escolha um ficheiro `.swf` legalmente obtido no dispositivo ou cole um URL público e HTTPS num servidor que permita CORS. O carregamento por URL só começa quando toca em **Carregar URL**. O pedido usa CORS, não envia cookies nem credenciais HTTP e não segue redirecionamentos. URLs com parâmetros de consulta, fragmentos ou credenciais incorporadas são recusados para evitar o envio acidental de tokens.

Para validar uma compilação de produção local:

```sh
npm test
npm run build
npm run preview
```

O runtime Ruffle é instalado pelo npm e copiado para `public/vendor/ruffle` durante a instalação. Esses ficheiros gerados ficam fora do Git; a compilação volta a copiá-los antes de criar `dist`.

## Testar no iPhone 15

1. Publique a aplicação num endereço HTTPS (por exemplo, GitHub Pages) e abra-o no Safari.
2. Para a experiência PWA, use **Partilhar → Adicionar ao ecrã principal**.
3. Rode o iPhone na horizontal para dar mais espaço ao leitor. Os botões direcionais e A/B enviam teclas enquanto forem premidos; o conteúdo pode usar mapeamentos diferentes.
4. Para escolher um SWF local, use o seletor de ficheiros do iOS. Um SWF carregado do dispositivo permanece na memória desta página e não é enviado para um servidor pela aplicação.

O modo offline guarda apenas o invólucro estático da aplicação. Não guarda SWFs nem torna o runtime de rede do filme offline.

## Publicar gratuitamente no GitHub Pages

O workflow `.github/workflows/pages.yml` compila e publica `dist` com GitHub Actions. Depois de enviar esta branch para o GitHub:

1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment**, selecione **GitHub Actions**.
3. Depois de integrar as alterações na branch `main`, acompanhe **Actions → Deploy to GitHub Pages**.

A compilação configura o caminho `/naruto-online-mobile/` deste repositório. Para um domínio próprio, defina `VITE_BASE_PATH=/` no workflow ou no ambiente de compilação.

## Diagnóstico e limites

- Os diagnósticos mostram inicialização do Ruffle, validação básica do cabeçalho SWF, erros HTTP visíveis e falhas de rede/CORS. Por razões do navegador, não é possível distinguir sempre uma falha CORS de DNS, TLS, conteúdo misto ou conectividade.
- Uma resposta HTTP bem-sucedida e um cabeçalho SWF reconhecido não confirmam que o conteúdo seja suportado. Erros internos de ActionScript, recursos externos e comportamento de jogo podem não chegar à página.
- A aplicação não recolhe, guarda, envia nem regista credenciais ou cookies. Não introduza credenciais num filme SWF. Recursos de rede pedidos pelo próprio filme continuam sujeitos às políticas do navegador e do Ruffle.
- O carregador não usa proxy, não contorna CORS e não altera respostas do servidor. O URL remoto deve ser acessível diretamente pelo navegador.
- AS3, comunicação de rede, autenticação, janelas emergentes, áudio e outros recursos de Flash têm compatibilidade variável. A checklist na aplicação mantém estes pontos como **por verificar** até um teste com o cliente original.
- O Ruffle é um emulador em desenvolvimento; o comportamento e a compatibilidade dependem da versão do runtime e do conteúdo testado.

## Investigação do cliente original

Os resultados das fontes públicas oficiais, os limites técnicos conhecidos e o procedimento para testar futuramente uma amostra autorizada estão em [docs/naruto-online-compatibility-research.md](docs/naruto-online-compatibility-research.md). O cliente inglês original continua sem teste de compatibilidade.

A matriz técnica de APIs do Ruffle, os resultados dos fixtures locais e o que os testes não demonstram estão em [docs/ruffle-capability-lab.md](docs/ruffle-capability-lab.md). Os ensaios do painel são isolados e não contactam os serviços do jogo.

## Conteúdo e licenças

Não inclui o cliente, imagens, dados, fontes ou música de Naruto Online. Use apenas ficheiros que tenha direito de testar. O Ruffle mantém a licença MIT/Apache-2.0 indicada pelo respetivo pacote; os ícones incluídos foram desenhados para este projeto.
