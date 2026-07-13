# Slider de imagens no hero da home

## Objectivo

Substituir a imagem única do hero da página inicial por uma sequência automática de imagens institucionais da APGB. A imagem deve mudar a cada cinco segundos sem alterar o texto institucional, os botões ou a estrutura existente do hero.

## Solução

Será criado um componente cliente dedicado ao hero. O componente recebe a lista de imagens, mantém o índice activo e avança automaticamente com um temporizador de cinco segundos. A imagem activa será apresentada através do componente `Image` do Next.js.

As imagens utilizadas serão a sede principal, o edifício de operações, a entrada do porto, o posto de pesagem e o posto médico. Os textos alternativos serão definidos individualmente no manifesto de media.

## Interacção e acessibilidade

O slider terá indicadores seleccionáveis para permitir a navegação directa entre imagens. Os indicadores terão `aria-label` e indicarão qual é o slide activo. O temporizador será limpo quando o componente for desmontado. A animação será reduzida quando o utilizador tiver activa a preferência de movimento reduzido.

O texto sobre a imagem permanecerá fixo para assegurar consistência da mensagem institucional e evitar alterações de leitura durante a rotação. O enquadramento usará `object-fit: cover` e manterá a altura actual do hero em desktop e mobile.

## Validação

Será validado que a home continua a responder com estado 200, que as cinco imagens estão disponíveis, que a compilação e os testes passam e que não existem erros de TypeScript ou problemas de formatação.
