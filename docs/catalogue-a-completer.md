# Catalogue véhicules — informations manquantes

Ce document accompagne `catalogue-a-completer.csv`.

Les 23 fiches PDF reçues contiennent 20 véhicules distincts. Trois fichiers sont
des doublons :

- `NEW MERCEDES C350 ... (2).pdf` — fichier identique
- `NEW 2025 NISSAN PATROL ... (2).pdf` — fichier identique
- `NEW 2025 TOYOTA LC300 VX.R+ ... 2.pdf` — même véhicule, une faute corrigée

## Ce que les fiches prouvent

Marque, modèle, année, énergie, boîte de vitesses, moteur, puissance, cylindrée
et nombre de places. Ces colonnes sont déjà remplies.

## Ce qu'il faut fournir

Quatre colonnes sont vides. Le site ne peut pas publier un véhicule sans elles.

1. **prix_fcfa** — aucune fiche ne porte de prix. Chiffre entier, sans espaces.
2. **kilometrage** — mettre `0` si le véhicule est neuf.
3. **vin** — 17 caractères. Laisser vide si le véhicule n'est pas encore immatriculé.
4. **couleur** — seule la fiche G63 AMG indique une couleur.

La colonne **statut** vaut `available` par défaut. Valeurs possibles :
`available`, `reserved`, `sold`.

## Deux points à confirmer

1. **Fiche `NEW MERCEDES C350 ...`** — le titre à l'intérieur du PDF indique
   **CLASSE E350 COUPE**, pas C350. Quel est le bon modèle ?
2. **Ferrari Purosangue** — aucune année sur la fiche. Quelle est l'année ?

## Adresse du showroom

Les fiches PDF indiquent trois adresses :

- Mansour Motors Almadies, près de Bio 24, en face de Vogue, Almadies
- Mansour Motors Saly, en face de l'institut Diambar, route de Diambar, Saly
- Mansour Motors Kaloum-Manquépas, 3e Avenue, Conakry, Guinée

Le site affiche aujourd'hui une seule adresse : route de la Corniche Ouest,
Almadies, Dakar. Il faut trancher : quelle adresse le site public doit-il
montrer, et faut-il présenter les trois showrooms ?
