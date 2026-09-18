#!/bin/bash

# Criação das pastas de conteúdo caso não existam
mkdir -p src/content/speakers
mkdir -p src/content/schedule

echo "Criando arquivos de palestrantes..."

cat << 'EOF' > "src/content/speakers/Jermana.json"
{
  "name": "Jermana",
  "role": "Professora / Pesquisadora",
  "bio": "Biografia a definir.",
  "avatar": "/images/speakers/Jermana/avatar.png"
}
EOF

cat << 'EOF' > "src/content/speakers/Vanessa.json"
{
  "name": "Vanessa",
  "role": "Professora / Pesquisadora",
  "bio": "Biografia a definir.",
  "avatar": "/images/speakers/Vanessa/avatar.png"
}
EOF

cat << 'EOF' > "src/content/speakers/Ialis.json"
{
  "name": "Iális",
  "role": "Professor Doutor",
  "bio": "Biografia a definir.",
  "avatar": "/images/speakers/Ialis/avatar.png"
}
EOF

cat << 'EOF' > "src/content/speakers/Caio Marçal.json"
{
  "name": "Caio Marçal",
  "role": "Especialista",
  "bio": "Biografia a definir.",
  "avatar": "/images/speakers/Caio Marçal/avatar.png"
}
EOF

cat << 'EOF' > "src/content/speakers/Jonh Aquino.json"
{
  "name": "Jonh Aquino",
  "role": "Especialista",
  "bio": "Biografia a definir.",
  "avatar": "/images/speakers/Jonh Aquino/avatar.png"
}
EOF

cat << 'EOF' > "src/content/speakers/Hygor Leal.json"
{
  "name": "Hygor Leal",
  "role": "Pesquisador",
  "bio": "Biografia a definir.",
  "avatar": "/images/speakers/Hygor Leal/avatar.png"
}
EOF


echo "Criando arquivos de cronograma..."

cat << 'EOF' > "src/content/schedule/segunda-roda-de-conversa.json"
{
  "title": "Roda de Conversa",
  "type": "palestra",
  "date": "19/Outubro",
  "startTime": "13:30",
  "endTime": "14:30",
  "speakerName": "Jermana e Vanessa",
  "location": "Sala de Audiovisual"
}
EOF

cat << 'EOF' > "src/content/schedule/segunda-normalizacao.json"
{
  "title": "Oficina Normalização e Elaboração",
  "type": "oficina",
  "date": "19/Outubro",
  "startTime": "14:40",
  "endTime": "15:40",
  "speakerName": "A definir",
  "location": "Laboratório de Simulações Numéricas"
}
EOF

cat << 'EOF' > "src/content/schedule/segunda-palestra-ialis.json"
{
  "title": "Palestra de Iális",
  "type": "palestra",
  "date": "19/Outubro",
  "startTime": "16:50",
  "endTime": "17:00",
  "speakerName": "Iális",
  "location": "Sala de Audiovisual"
}
EOF

cat << 'EOF' > "src/content/schedule/segunda-overleaf.json"
{
  "title": "Oficina Overleaf",
  "type": "oficina",
  "date": "19/Outubro",
  "startTime": "17:00",
  "endTime": "18:00",
  "speakerName": "João Paulo Militão",
  "location": "Laboratório de Simulações Numéricas"
}
EOF

cat << 'EOF' > "src/content/schedule/terca-ingles.json"
{
  "title": "Oficina Inglês",
  "type": "oficina",
  "date": "20/Outubro",
  "startTime": "13:30",
  "endTime": "14:30",
  "speakerName": "A definir",
  "location": "Laboratório de Simulações Numéricas"
}
EOF

cat << 'EOF' > "src/content/schedule/terca-zotero-ia.json"
{
  "title": "Oficina Ferramentas: Zotero, IA",
  "type": "oficina",
  "date": "20/Outubro",
  "startTime": "14:40",
  "endTime": "15:40",
  "speakerName": "A definir",
  "location": "Laboratório de Simulações Numéricas"
}
EOF

cat << 'EOF' > "src/content/schedule/terca-palestra-caio.json"
{
  "title": "Palestra de Caio Marçal",
  "type": "palestra",
  "date": "20/Outubro",
  "startTime": "16:50",
  "endTime": "17:00",
  "speakerName": "Caio Marçal",
  "location": "Sala de Audiovisual"
}
EOF

cat << 'EOF' > "src/content/schedule/terca-estatistica.json"
{
  "title": "Oficina Dados e Estatística",
  "type": "oficina",
  "date": "20/Outubro",
  "startTime": "17:00",
  "endTime": "18:00",
  "speakerName": "Hygor Leal",
  "location": "Laboratório de Simulações Numéricas"
}
EOF

cat << 'EOF' > "src/content/schedule/quarta-apresentacao-1.json"
{
  "title": "Apresentação de Trabalhos #1",
  "type": "palestra",
  "date": "21/Outubro",
  "startTime": "13:30",
  "endTime": "14:30",
  "speakerName": "Diversos",
  "location": "Sala de Audiovisual"
}
EOF

cat << 'EOF' > "src/content/schedule/quarta-apresentacao-2.json"
{
  "title": "Apresentação de Trabalhos #2",
  "type": "palestra",
  "date": "21/Outubro",
  "startTime": "14:40",
  "endTime": "15:40",
  "speakerName": "Diversos",
  "location": "Sala de Audiovisual"
}
EOF

cat << 'EOF' > "src/content/schedule/quarta-palestra-jonh.json"
{
  "title": "Palestra de Jonh Aquino",
  "type": "palestra",
  "date": "21/Outubro",
  "startTime": "16:50",
  "endTime": "17:00",
  "speakerName": "Jonh Aquino",
  "location": "Sala de Audiovisual"
}
EOF

cat << 'EOF' > "src/content/schedule/quarta-fechamento.json"
{
  "title": "Fechamento - Roda de Conversa",
  "type": "palestra",
  "date": "21/Outubro",
  "startTime": "17:00",
  "endTime": "18:00",
  "speakerName": "Organização SEAS",
  "location": "Sala de Audiovisual"
}
EOF

echo "Script executado com sucesso! Todos os arquivos JSON foram gerados nas pastas corretas."