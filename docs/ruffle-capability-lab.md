# Matriz técnica e ensaios isolados do Ruffle

**Data:** 22 de outubro de 2026

**Runtime empacotado pela aplicação:** `@ruffle-rs/ruffle` 0.6.0
**Âmbito:** documentação e código públicos upstream do Ruffle consultados nesta data, plataforma WebKit/Safari e SWFs próprios deste projeto. A execução do painel usa o pacote Ruffle 0.6.0 fixado na aplicação. Não foram ligados servidores de Naruto Online nem usados ficheiros, contas, cookies, tokens ou sessões do jogo.

## Conclusão resumida

O Ruffle Web executa uma parte relevante de AVM2/ActionScript 3 e inclui implementações de `URLLoader`, `Socket`, `XMLSocket`, `NetConnection`, `ExternalInterface` e `Loader`. A cobertura é parcial e a Web impõe limites que o Flash Player nativo não tinha. Em particular, o Safari não expõe TCP bruto a uma página; o suporte Web de sockets do Ruffle usa `WebSocket` através de uma configuração `socketProxy`. Não está configurado nenhum proxy neste projeto.

O SWF principal do Naruto Online e as suas dependências não estão disponíveis como amostra pública autorizada. Por isso, os ensaios abaixo medem apenas o runtime e os caminhos usados pelo nosso SWF de demonstração. **Não demonstram que Naruto Online funcione no Ruffle ou no Safari do iPhone 15.**

## Classificação das APIs

As categorias descrevem a evidência disponível:

- **Suportado:** o caminho restrito do fixture passou no browser desta sessão; isto não amplia a afirmação para qualquer SWF.
- **Parcialmente suportado:** existe implementação, mas há limites de browser, configuração, semântica incompleta ou ausência de validação suficiente.
- **Não suportado:** a plataforma ou a implementação atual não fornece o mecanismo necessário.
- **Desconhecido:** não há evidência sobre o cliente Naruto Online ou o comportamento específico que ele exige.

“Parcial” significa que existe código para um subconjunto, não que a API nem um jogo específico estejam integralmente compatíveis.

| API / mecanismo | Estado | Evidência e limite | Ensaio local |
| --- | --- | --- | --- |
| ActionScript 3 / AVM2 | **Parcial** | A matriz oficial do Ruffle descreve AVM2 como suporte em desenvolvimento. O valor agregado de compatibilidade não é uma medição do cliente Naruto Online. | O SWF próprio executa código compilado para AVM2; o resultado aparece no painel quando a execução consegue comunicar com a página. |
| `URLLoader` | **Parcial** | O código oficial encaminha `URLLoader.load()` ao carregador assíncrono de dados do Ruffle. No Web, o pedido passa pelas APIs e políticas do browser; CORS pode bloquear recursos cross-origin. | Lê `capability-resource.txt`, servido pela mesma origem. |
| `Socket` | **Parcial na Web** | Há caminho AVM2 no código do Ruffle. A opção oficial `socketProxy` liga um host/porta Flash a um URL WebSocket; sem correspondência configurada a ligação falha. Isso não é TCP bruto do browser. | **Inconclusivo**, intencionalmente: não existe servidor de protocolo de teste neste projeto. |
| `XMLSocket` | **Parcial na Web** | O gestor de sockets do Ruffle trata o objeto XMLSocket do AVM1 e encaminha a ligação ao mesmo backend de sockets. A utilização de um servidor e do transporte Web continua necessária. | **Inconclusivo**, intencionalmente: não foi contactado servidor. |
| `NetConnection` | **Parcial; não HTTP não suportado** | O código atual encaminha URLs HTTP(S) para Flash Remoting por POST. Ligações não HTTP passam por um stub; RTMP e protocolos específicos não ficam cobertos por isso. O anúncio do projeto sobre Flash Remoting (“more or less as expected”) não atesta um serviço concreto. | **Inconclusivo**: não há endpoint AMF local de teste. |
| `ExternalInterface` | **Parcial e condicionado** | O Ruffle implementa chamadas e callbacks. A opção `allowScriptAccess` tem predefinição `false`; `allowNetworking: "internal"` também impede `ExternalInterface.call()`. | O SWF próprio, e só ele, usa `allowScriptAccess: true` e `allowNetworking: "all"` para testar a ida e volta. |
| `Loader.load()` / SWF externo | **Parcial** | O código do Ruffle cria um carregamento assíncrono de filme; a existência dessa implementação não cobre toda a semântica de domínios, eventos ou reutilização do Loader. O acesso ao recurso continua condicionado pelo browser e por CORS. | Carrega `capability-child.swf`, da mesma origem. |
| `allowNetworking: "none"` | **Não suportado na versão documentada** | A própria documentação da API diz que o modo `none` “is not implemented yet”. `internal` não significa ausência de rede: apenas impede navegação e integração com a página. | Não é usado para prometer isolamento. |
| Socket TCP bruto numa página Safari | **Não suportado** | As APIs Web acessíveis à página oferecem WebSocket, não um socket TCP arbitrário. O `socketProxy` do Ruffle é uma tradução explícita para WebSocket e depende de infraestrutura compatível. | Não foi tentado; não existe endpoint nem proxy neste projeto. |
| API e protocolo realmente usados pelo Naruto Online atual | **Desconhecido** | Não existe SWF autorizado para inspecionar; não se inferem `URLLoader`, `Socket`, `XMLSocket`, `NetConnection`, cookies ou protocolo a partir da existência histórica de Flash. | Não testado e não ligado aos serviços do jogo. |

### O que quer dizer o estado do painel

- **PASSOU**: o ensaio próprio observou o resultado esperado naquela sessão e naquele browser.
- **FALHOU**: o SWF próprio recebeu um evento de falha ou uma resposta diferente do valor esperado. Isso não identifica por si só se a causa é implementação, carregamento ou política de rede.
- **INCONCLUSIVO**: não há servidor de protocolo, não chegou confirmação observável no prazo ou o ambiente impediu separar as causas.

Os eventos de `ExternalInterface` são necessários para o painel observar a execução ActionScript. Se essa ponte não inicializar, o painel não tenta inferir sucesso a partir de uma tela vazia: marca o resultado como inconclusivo.

## Safari, CORS, cookies, TCP e WebAssembly

### Safari e WebAssembly

O utilizador confirmou anteriormente que o Ruffle inicializa no Safari do iPhone 15 e que WebAssembly está disponível. O teste de compatibilidade deste repositório não volta a validar esse dispositivo. A disponibilidade de WebAssembly só confirma a base de execução; não confirma suporte a uma API Flash, desempenho de um cliente grande, memória suficiente ou continuidade depois de suspender/retomar a página. Limites de memória e de tempo dependem do iOS, do Safari e da pressão de recursos do dispositivo; não foram medidos aqui.

### HTTP(S) e CORS

Pedidos do `URLLoader`, de `Loader.load()` e outros carregadores Web passam pela política de origem do browser. Um recurso de outra origem necessita de cabeçalhos CORS adequados; o sucesso no servidor do ficheiro não basta se o browser não autorizar a resposta à página. Um erro observado pelo Flash pode ser apenas CORS, um redirecionamento ou uma falha HTTP. A aplicação não faz proxy nem contorna CORS.

### Cookies e autenticação

Na aplicação principal, os SWFs escolhidos pelo utilizador usam `allowScriptAccess: false`, `allowNetworking: "internal"` e `credentialAllowList: []`. O modo `internal` não bloqueia todos os pedidos de dados, e a documentação Ruffle indica que pedidos same-origin podem levar cookies da origem da página; `credentialAllowList` não transforma esse modo numa garantia de ausência de credenciais same-origin. O carregador URL explícito da aplicação usa `credentials: "omit"`.

O WebKit bloqueia cookies de terceiros por omissão e o estado de sessão pode depender de cookies first-party, CORS, `SameSite`, redirecionamentos, ITP e do contexto em que a página é aberta. A configuração de Ruffle não pode sobrepor-se a essas regras do Safari. Este projeto não recolhe nem mostra credenciais, não acrescenta origens à allowlist e não testa fluxos de login.

### TCP e sockets

Uma página Web não tem uma API para abrir um socket TCP bruto. Pode abrir WebSocket (`ws:`/`wss:`) se existir um servidor compatível, mas o protocolo WebSocket não é intercambiável com um protocolo binário Flash arbitrário. O Ruffle Web documenta `socketProxy` como o mecanismo de túnel para `Socket`/`XMLSocket`. Configurar um túnel para os servidores do jogo seria um proxy; não faz parte deste projeto nem deste teste.

### `ExternalInterface`

É possível testar comunicação entre Flash e JavaScript sem usar credenciais. A prova incluída é um SWF nosso: o ActionScript invoca uma função fixa da página e a página chama de volta um callback fixo do SWF. A opção de acesso a scripts é elevada apenas nesse player, apenas para esse ficheiro empacotado e após o botão **Executar testes locais**. O carregador normal de SWFs mantém `allowScriptAccess: false`.

## Procedimento e conteúdo dos fixtures

1. Executar a aplicação por HTTPS ou com `npm run dev` e esperar pela indicação de Ruffle pronto.
2. Premir **Executar testes locais**. Nada é carregado antes desta ação.
3. O browser obtém o SWF do próprio projeto com `credentials: "omit"`; o SWF pede apenas `capability-resource.txt` e `capability-child.swf` na origem da aplicação.
4. Ver os estados de AVM2, `ExternalInterface`, `URLLoader` e carregamento do SWF filho. Socket/XMLSocket e NetConnection ficam inconclusivos por não existir serviço de teste local.
5. Repetir no Safari do iPhone 15 para testar essa combinação física. Os resultados automatizados em computador não substituem esse passo.

Os fontes Haxe e as instruções de recompilação estão em `tests/swf-source/` e `public/test-fixtures/README.md`. Os binários foram criados para este projeto, não incluem código ou arte do jogo e não comunicam com servidores externos. A suíte automatizada valida o formato dos fixtures e a normalização dos estados; os ensaios de runtime decorrem no browser depois do toque explícito.

## Registo da validação desta revisão

Em 22 de outubro de 2026, o painel foi executado no browser local desta sessão com o Ruffle Web 0.6.0 empacotado pelo projeto. **Passaram** a execução do SWF AS3/AVM2, a ponte `ExternalInterface` nos dois sentidos, a leitura same-origin com `URLLoader` e a carga do SWF filho. Socket/XMLSocket e NetConnection ficaram **inconclusivos** porque não existe servidor de demonstração; nenhuma ligação foi aberta para o exterior.

Os testes automatizados passaram: **10/10** em dois ficheiros de teste. A compilação TypeScript e o build Vite de produção também passaram. O teste de runtime desta revisão não ocorreu no Safari do iPhone 15; a repetição física nesse dispositivo continua necessária.

## Porque isto não comprova compatibilidade com Naruto Online

1. Não há um SWF principal do jogo publicado com licença de redistribuição para esta aplicação; o SWF original não está incluído nem foi executado.
2. Não se conhecem os `flashvars`, a lista de SWFs/assets externos, formatos de dados, domínios, cabeçalhos, política CORS ou a versão exata de ActionScript do cliente atual.
3. O projeto não contacta serviços Oasis, não observa tráfego autenticado e não recolhe cookies, tokens ou passwords. Logo, não mede o protocolo real, a autenticação ou o estado de sessão.
4. Testar `URLLoader` com um texto same-origin não testa o comportamento de servidores de jogo cross-origin. O child SWF não representa um preloader real.
5. Um `SocketProxy` exigiria um transporte e um servidor autorizados a falar o protocolo correspondente. Nenhum foi criado. Um `NetConnection` HTTP local não prova que o jogo use Flash Remoting.
6. A cobertura agregada AS3 do Ruffle, código implementado e compatibilidade com um cliente particular são evidências diferentes.
7. O teste no computador não mede toque, latência, memória, lifecycle ou desempenho gráfico do Safari no iPhone 15.

**Conclusão:** os fixtures permitem verificar alguns blocos do Ruffle. Não existe aqui teste legítimo que prove que o cliente inglês do Naruto Online é jogável. A jogabilidade original continua **por verificar**.

## Fontes primárias

- [Ruffle: matriz de compatibilidade](https://ruffle.rs/compatibility)
- [Ruffle: `NetworkingAccessMode`](https://ruffle.rs/js-docs/master/enums/Config.NetworkingAccessMode.html)
- [Ruffle: opções de carregamento, scripts, credenciais e sockets](https://ruffle.rs/js-docs/master/interfaces/Config.BaseLoadOptions.html)
- [Ruffle: `SocketProxy`](https://ruffle.rs/js-docs/master/interfaces/Config.SocketProxy.html)
- [Ruffle: API do player e `callExternalInterface`](https://ruffle.rs/js-docs/master/interfaces/Player.PlayerV1.html)
- [Ruffle source: URLLoader](https://github.com/ruffle-rs/ruffle/blob/master/core/src/avm2/globals/flash/net/url_loader.rs), [NetConnection](https://github.com/ruffle-rs/ruffle/blob/master/core/src/avm2/globals/flash/net/net_connection.rs), [Loader](https://github.com/ruffle-rs/ruffle/blob/master/core/src/avm2/globals/flash/display/loader.rs), [ExternalInterface](https://github.com/ruffle-rs/ruffle/blob/master/core/src/avm2/globals/flash/external/external_interface.rs) e [gestor de sockets](https://github.com/ruffle-rs/ruffle/blob/master/core/src/socket.rs)
- [Ruffle: 2023 em revisão, sockets Web e Flash Remoting](https://ruffle.rs/blog/2024/01/14/2023-in-review)
- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) e [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [WebKit: prevenção de rastreamento e cookies third-party](https://webkit.org/tracking-prevention/)
- [Haxe: target Flash e criação de SWF](https://haxe.org/manual/target-flash-getting-started.html)
