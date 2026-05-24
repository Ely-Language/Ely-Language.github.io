import os
import json

def generate_index(base_path, output_file):
    structure = []
    for category in sorted(os.listdir(base_path)):
        category_path = os.path.join(base_path, category)
        if os.path.isdir(category_path):
            files = []
            for file in sorted(os.listdir(category_path)):
                if file.endswith('.md'):
                    # Имя страницы = имя файла без расширения, но можно задать красивое название
                    name = os.path.splitext(file)[0].replace('_', ' ').title()
                    files.append({"name": name, "file": file})
            if files:
                structure.append({"category": category, "files": files})
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(structure, f, ensure_ascii=False, indent=2)

# Для русской документации
generate_index('docsmdru', 'docsmdru/docs-index.json')
# Для английской
generate_index('docsmden', 'docsmden/docs-index.json')