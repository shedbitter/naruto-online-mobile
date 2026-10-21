# Investigação de compatibilidade do Naruto Online inglês

**Data da investigação:** 22 de outubro de 2026

**Âmbito:** páginas públicas oficiais do Naruto Online/Oasis Games e documentação oficial do Ruffle.
**Estado:** o cliente original não foi descarregado, extraído, carregado ou executado nesta investigação. Não foi usado um SWF do Naruto Online.

## Resultados

| Pergunta | Resultado |
| --- | --- |
| O cliente de navegador usava Flash? | **Sim, as páginas oficiais indicam que sim.** As instruções oficiais de 2017 dizem que é necessário ativar o plugin Adobe Flash Player para entrar no jogo. Um guia oficial de 2020 direciona os jogadores para `https://naruto.oasgames.com/en/serverlist` num navegador com Flash e manda escolher um servidor. |
| O jogo usa SWF? | A dependência do Flash é uma forte indicação de um cliente baseado em filmes SWF. Porém, as páginas oficiais consultadas não identificam um SWF, não publicam o nome do ficheiro de entrada e não descrevem a cadeia de carregamento interna. |
| Existe um SWF de entrada público e redistribuível? | **Não foi localizado.** O Download Center oficial publica instaladores do Mini Client, não um SWF isolado. Nenhum nome como `main.swf` ou `game.swf` foi confirmado e não se deve adivinhar nomes. |
| É possível confirmar AS3, protocolo de rede ou fluxo de autenticação dentro do cliente? | **Não sem uma amostra autorizada.** As páginas oficiais confirmam uma experiência online com conta e cookies, mas não especificam a versão ActionScript nem as APIs, domínios e protocolos usados pelo filme. |
| A compatibilidade com Ruffle/iPhone está demonstrada? | **Não.** A aplicação e o Ruffle podem funcionar no Safari; isso não prova que o cliente original ou a sua autenticação funcionem. |

## Evidência oficial consultada

- A página [Adobe Flash Player Plugin Settings](https://naruto.narutowebgame.com/en/articlelist/all/adobe_flash_player_plugin_settings), publicada em 2017, explica que o plugin Flash precisa de ser ativado no Chrome para entrar no jogo. É evidência de que o cliente de navegador dependia do Flash naquele momento.
- No tópico [Alternative way to play the Game - Browser](https://forum-narutoen.narutowebgame.com/page/show-post-49567-1.html), a equipa de operações, em 2020, indica o endereço `/en/serverlist`, um navegador com Flash e a seleção do servidor. Isto descreve o fluxo visível de entrada no cliente de navegador, mas não mostra o ficheiro SWF carregado depois da seleção.
- O [Download Center](https://naruto.narutowebgame.com/en/articlelist/all/all_version_mini_client_download), publicado em 2022, oferece versões do Mini Client para Windows e recomenda um navegador compatível com Flash para Mac. A página lista instaladores (incluindo V3.4.7.0), não um SWF autónomo.
- Um tópico de suporte de 2024, [Client bug](https://forum-narutoen.narutowebgame.com/page/show-post-57697-1.html), reproduz uma mensagem do cliente sobre Flash Player inferior a 11.4 e aponta para o Download Center. A mensagem vem de um relato de utilizador; não é especificação oficial do ActionScript utilizado.
- A [política de privacidade do Naruto Online](https://profile.oasgames.com/static-page/naruto/privacy-policy-en.html) descreve IDs Oasis/Facebook, dados da conta e do jogo, verificação da conta e cookies. Confirma dependências de conta e serviços online, mas não revela o protocolo do cliente.
- Os [termos de serviço](https://profile.mars.games/static-page/terms-of-service-en.html) protegem os materiais do serviço e restringem a sua cópia, distribuição, modificação e exploração sem autorização prévia por escrito. O Download Center oferece instaladores, mas não encontrei uma licença separada que autorize extrair, republicar ou incorporar os ficheiros do jogo noutro site.

As páginas públicas consultadas permitem afirmar que o navegador abria o jogo através do fluxo Flash e da seleção de servidor. Não fornecem uma referência de ficheiro `.swf` nem deixam determinar se o cliente carregava um filme principal mais filmes secundários, assets ou módulos de rede. Tentativas de leitura direta das páginas no ambiente desta investigação foram bloqueadas pelo Cloudflare; essa restrição não foi contornada. Os resultados acima baseiam-se nas páginas públicas oficiais apresentadas pelos respetivos domínios e respetivos índices públicos.

## AS3 e compatibilidade do Ruffle

Não temos o SWF para inspecionar. Portanto, não se pode afirmar que o Naruto Online usa AS3 nem que depende de uma API específica. A mensagem relatada de Flash Player 11.4 não é suficiente para inferir AS3: a versão mínima do runtime não identifica, por si só, o bytecode ou as APIs usadas pelo filme.

A [página de compatibilidade do Ruffle](https://ruffle.rs/compatibility) indica suporte parcial para AVM2/ActionScript 3 e continua a assinalar trabalho em curso. As percentagens e a descrição geral do projeto medem cobertura agregada, não compatibilidade com o Naruto Online. Só uma amostra autorizada permite verificar a versão SWF, o marcador AS3/AVM2, os recursos usados e os erros de execução relevantes.

## Rede e autenticação

O jogo é uma experiência online: as páginas oficiais apresentam login e seleção de servidor, e a política de privacidade refere dados de conta e jogo, verificação de conta e cookies. **Inferência:** o cliente precisa comunicar com serviços do editor para autenticar e sincronizar o estado do jogo. **Os detalhes do protocolo continuam desconhecidos**: não foi possível confirmar se o SWF usa `URLLoader`, `NetConnection`, sockets, domínios de recursos específicos, tokens, redirecionamentos ou outras APIs.

Na configuração atual do projeto, `allowNetworking: "internal"` não desativa todos os pedidos do filme. Segundo a [documentação de rede do Ruffle](https://ruffle.rs/js-docs/master/enums/Config.NetworkingAccessMode.html), esse modo impede chamadas de navegação/integração com a página, incluindo `navigateToURL()`, `fscommand()` e `ExternalInterface.call()`. A aplicação também define `allowScriptAccess: false`. Estas proteções podem impedir um fluxo de login que dependa de abrir páginas ou de comunicar com JavaScript.

Pedidos de rede do próprio SWF continuam sujeitos às regras do navegador, incluindo CORS. O Ruffle documenta `credentialAllowList` como a lista de origens que podem receber credenciais; vazia, como está no projeto, não acrescenta origens de credenciais, e a regra predefinida continua limitada à origem da página. **Consequência provável (inferência):** como a aplicação é alojada num domínio diferente do domínio do jogo, pedidos autenticados do SWF para os servidores Oasis podem falhar por CORS ou por falta de sessão. O carregador de URL da aplicação também usa CORS, omite credenciais e recusa redirecionamentos. A aplicação não recolhe nem solicita passwords, cookies ou tokens.

O painel de diagnóstico pode apresentar falhas de carregamento, HTTP, CORS e runtime que sejam observáveis. Uma falha CORS não prova que o SWF seja incompatível; da mesma forma, o carregamento inicial não prova que a autenticação, a comunicação de jogo, todos os recursos ou os controlos táteis funcionem. Erros internos do ActionScript e algumas falhas de rede podem não chegar à aplicação.

## Ficheiros que podem ser testados legitimamente

Não foi encontrado um SWF isolado que o editor declare redistribuível ou publique para fins de teste. O [Download Center oficial](https://naruto.narutowebgame.com/en/articlelist/all/all_version_mini_client_download) publica instaladores do Mini Client; não indica nomes de SWF nem autorização para os extrair e carregar noutro player. Por isso:

1. Não incluir nem redistribuir conteúdo do Naruto Online neste repositório.
2. Não extrair ficheiros de cache ou do Mini Client para este teste sem autorização explícita. Para testar o cliente fora do ambiente distribuído pelo editor, pedir ao editor uma amostra SWF isolada e autorização para a usar nesse teste.
3. Em alternativa, usar um SWF de demonstração com licença aberta e comprovável para validar o leitor, ou um ficheiro fornecido pelo utilizador com autorização adequada. Isso testa o leitor, não a compatibilidade do Naruto Online.

## Procedimento de teste quando houver uma amostra autorizada

1. Registar a origem do SWF, a licença/autorização, a versão do ficheiro e a data. Não usar ficheiros de espelhos não oficiais, conteúdo obtido de endpoints autenticados ou links com tokens.
2. Abrir a aplicação publicada por HTTPS no Safari do iPhone 15 e rodar para a horizontal. Não introduzir credenciais do Naruto Online na aplicação.
3. Preferir o seletor de ficheiros do iOS para carregar o SWF localmente. O ficheiro fica na memória da página segundo o comportamento documentado da aplicação. Se a autorização fornecer uma URL pública direta, usar **Carregar URL** apenas quando seja HTTPS, a origem permita CORS e a resposta não exija cookies, credenciais, redirecionamentos ou parâmetros de sessão. Não usar proxy nem tentar contornar essas restrições.
4. Registar o que o painel confirma separadamente: inicialização do runtime, leitura do cabeçalho, início/fim do carregamento e erros visíveis. Anotar modelo do iPhone, versão do iOS/Safari e versão do Ruffle fornecida pela aplicação.
5. Comparar com um SWF de demonstração autorizado que funcione como controlo. Se o demo funcionar e o SWF do jogo falhar, classificar a causa apenas com a evidência observada: formato/AS3, API não suportada, recurso externo, CORS, autenticação ou erro não observável. Não inferir que a causa foi ActionScript só porque a tela ficou em branco.
6. Fazer qualquer teste de conta apenas num procedimento oficialmente autorizado pelo editor, sem inserir passwords, cookies ou tokens nesta aplicação. A configuração atual intencionalmente não fornece acesso adicional a credenciais nem abre integração do filme com JavaScript.

Um SWF de demonstração pode validar o invólucro, o Ruffle e os controlos. Não substitui a obtenção autorizada do cliente original, e não há atualmente um ficheiro do Naruto Online neste repositório para executar esse teste.

## Conclusão

As fontes oficiais confirmam uma versão de navegador dependente do Flash e uma alternativa oficial Mini Client. Não foi identificado um SWF de entrada autónomo e autorizado para este projeto, nem foi possível estabelecer requisitos AS3, hosts/protocolos de rede ou o fluxo real de autenticação. A compatibilidade do cliente original com Ruffle e Safari no iPhone 15 permanece **por verificar**.
