# search.py
import sys
import json
import re

def search(marques, term):
    regex = re.compile(re.escape(term), re.IGNORECASE)
    results = []
    for marque in marques:
        if regex.search(marque['description']):
            # Appliquer la mise en évidence
            highlighted = regex.sub(f'<mark>{term}</mark>', marque['description'])
            results.append({**marque, "description": highlighted})
    return results

if __name__ == '__main__':
    # Lire les données depuis stdin
    data = sys.stdin.read()
    params = json.loads(data)
    output = search(params['marques'], params['term'])
    # Renvoyer les résultats sous forme de JSON
    print(json.dumps(output))
