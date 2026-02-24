# Inicio

git checkout main
git pull

git checkout -b feature/nova-feature

# trabalhar

git add .
git commit -m "feat: descrição"

git push -u origin feature/nova-feature

- abrir Pull Request

# após merge
git checkout main
git pull
git branch -d feature/nova-feature