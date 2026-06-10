# APGB Design System

## Direction

Direcção híbrida institucional e operacional. O portal usa superfícies brancas, azul APGB, azul-marinho governamental e fotografias reais do Porto de Bissau. A imagem conduz a narrativa. Transparências aparecem só sobre fotografias, em atalhos que mantêm contraste acessível.

## Colour

- `--apgb-blue`: `#0647D9`, acções principais e ligações
- `--apgb-blue-dark`: `#043B8F`, estados activos
- `--navy`: `#062B5C`, cabeçalhos, rodapé e texto sobre fotografia
- `--ink`: `#10233F`, texto principal
- `--muted`: `#52677F`, texto secundário
- `--canvas`: `#FFFFFF`, fundo principal
- `--surface`: `#F3F7FB`, secções alternadas
- `--line`: `#DCE7F2`, separadores
- `--success`: `#16794B`
- `--warning`: `#A85D00`
- `--danger`: `#B42318`

## Typography

Usar Public Sans em toda a interface. A família foi criada para contextos de serviço público, suporta leitura densa e mantém uma voz contemporânea.

- Hero: `clamp(2.75rem, 6vw, 5.75rem)`, peso 650, entrelinha 0.98
- Título de página: `clamp(2.25rem, 4vw, 4.5rem)`, peso 650
- Título de secção: `clamp(1.8rem, 3vw, 3rem)`, peso 650
- Corpo principal: `1rem`, entrelinha 1.7, máximo 72 caracteres
- Meta-informação: `0.75rem`, peso 700

## Layout

- Largura máxima: 1440 px
- Conteúdo editorial: máximo 780 px
- Margens fluidas: `clamp(1rem, 4vw, 4.5rem)`
- Espaçamento de secção: `clamp(4rem, 8vw, 8rem)`
- Cantos: 8 px em controlos, 12 px em imagens e contentores
- Cabeçalho com barra governamental, logótipo APGB e seis menus principais

## Navigation

Menus principais:

1. Home
2. Autoridade Portuária
3. Porto de Bissau
4. Área de Negócio Portuário
5. Área Social
6. Projectos

Os restantes itens do documento de menu são submenus ou agrupadores internos. O logótipo e o botão APGB ligam à página inicial.

## Imagery

Cada página pública deve usar pelo menos uma imagem contextual do acervo APGB. As fotografias de operações, contentores, navios, edifícios e equipas são classificadas e associadas às secções adequadas. A galeria inclui todo o acervo fotográfico único. Não repetir a mesma imagem principal em páginas próximas.

Aplicar recorte responsivo, `object-fit: cover`, texto alternativo descritivo e compressão WebP. Não aplicar filtros pesados. Sobreposições escuras são permitidas quando necessárias para contraste.

## Components

- Barra governamental compacta
- Cabeçalho principal e mega menu acessível
- Hero fotográfico por página
- Atalhos operacionais sobre fotografia
- Lista editorial para notícias e documentos
- Tabelas responsivas para tarifas e estatísticas
- Linha cronológica para historial
- Organigrama com imagem e versão textual acessível
- Galeria fotográfica com filtros
- Rodapé institucional completo

## Motion

Movimento discreto, com duração entre 160 e 320 ms. Menus, galerias e transições usam `ease-out`. Não esconder conteúdo até uma animação iniciar. Respeitar `prefers-reduced-motion`.

## Quality Rules

- Não usar gradiente em texto.
- Não usar glassmorphism fora de fotografia.
- Não repetir grelhas idênticas em todas as secções.
- Não combinar borda fina com sombra larga.
- Não usar etiquetas em maiúsculas acima de todos os títulos.
- Garantir contraste WCAG 2.2 AA.

