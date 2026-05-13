import pandas as pd
import re

class EnqueteNE:

    def __init__(self, filter):

        self.filter = filter

    def filtrer_logements(usage):
        if usage == "Habitation":
            return True
        else:
            return False
        
    def filtrer_commercial(usage):
        if usage == "Local" or usage == "Restaurant" or usage == "Commercial" or usage == "Commerce" or usage == "Bureaux":
            return True
        else:
            return False

    @staticmethod
    def get_vacants_logements():
        vacants = pd.read_excel('data/enqueteNE/vacants.xlsx')
        vacants = vacants[[EnqueteNE.filtrer_logements(i) for i in vacants["Usage désignation"]]]
        vacants = EnqueteNE.get_vacants(vacants)
        def get_catégorie(vacant):
            if vacant["Genre désignation"] == "Immeuble mixte":
                return "Maison à utilisation mixte"
            if not vacant["Appartements nb"] or vacant["Appartements nb"] <= 1:
                return "Maison individuelle"
            elif vacant["Appartements nb"] <= 6:
                return "Maison de 2 à 6 logements"
            else:
                return "Maison de 7 logements et plus"
        vacants["Appartements nb"] = vacants.apply(get_catégorie, axis=1)

        def get_nb_pieces(nb_pieces):
            if not nb_pieces:
                return ""
            if nb_pieces < 2:
                return "1 ou 1.5 pièces"
            elif nb_pieces < 3:
                return "2 ou 2.5 pièces"
            elif nb_pieces < 4:
                return "3 ou 3.5 pièces"
            elif nb_pieces < 5:
                return "4 ou 4.5 pièces"
            elif nb_pieces < 6:
                return "5 ou 5.5 pièces"
            else:
                return "6 pièces ou plus"
        vacants["Nb pces cantonales"] = vacants["Nb pces cantonales"].apply(get_nb_pieces)

        def get_annee_construction(date_construction):
            return "2 ans et plus"
        vacants["Construction fin"] = vacants["Construction fin"].apply(get_annee_construction)

        def get_duree_vacance(nb_jours):
            if not nb_jours or nb_jours < 120:
                return "Moins de 4 mois"
            elif nb_jours <= 356:
                return "De 4 mois à un an"
            else:
                return "Plus d’un an"
        vacants["Nombre de jours"] = vacants["Nombre de jours"].apply(get_duree_vacance)
        vacants = vacants.drop(columns=["Genre désignation", "Surface", "Usage désignation"])

        return vacants.to_json(orient='records')
    
    @staticmethod
    def get_vacants_commercial():
        vacants = pd.read_excel('data/enqueteNE/vacants.xlsx')
        vacants = vacants[[EnqueteNE.filtrer_commercial(i) for i in vacants["Usage désignation"]]]
        vacants = EnqueteNE.get_vacants(vacants)
        def get_catégorie(vacant):
            if vacant["Usage désignation"] == "Bureaux":
                return "Bureau, cabinet médical"
            else:
                return "Autre local"
        vacants["Appartements nb"] = vacants.apply(get_catégorie, axis=1)

        vacants = vacants.drop(columns=["Genre désignation", "Nb pces cantonales", "Construction fin", "Nombre de jours", "Usage désignation"])

        return vacants.to_json(orient='records')
    
    @staticmethod
    def get_vacants(vacants):
        localites = pd.read_csv('data/localite/localites_suisse.csv', sep=';')
        localites_unique = localites.drop_duplicates(subset="Ortschaftsname", keep="first")

        def clean_rue(val):
            if not isinstance(val, str):
                return val

            # 👉 protection des vrais noms de type "8 Mai", "11 Novembre"
            if re.search(r"\d+\s+[A-Za-zÀ-ÿ]{2,}", val):
                return re.sub(r"\s+\d+\s*[A-Za-zÀ-ÿ]*$", "", val).strip()

            # 👉 suppression du numéro et de ce qui suit
            return re.sub(r"\s+\d.*$", "", val).strip()
        vacants["Rue"] = vacants["Rue"].apply(clean_rue)

        vacants["Localité"] = vacants["Localité"].apply(lambda x: x if x in localites_unique["Ortschaftsname"].values else "")
        # Kantonskürzel == 'NE'

        vacants = vacants.merge(
            localites_unique[["Ortschaftsname", "Gemeindename", "Kantonskürzel"]],
            left_on="Localité",
            right_on="Ortschaftsname",
            how="left"
        )
        vacants = vacants[vacants['Kantonskürzel'] == 'NE']

        vacants["Commune"] = vacants["Gemeindename"].fillna("")
        vacants = vacants.drop(columns=["Ortschaftsname", "Gemeindename", "Canton", "Kantonskürzel"])
        vacants = vacants[["Commune"] + ["Localité"] + [c for c in vacants.columns if c != "Commune" and c != "Localité"]]

        def get_mode_occupation(type):
            return "À louer uniquement"
        vacants["Type désignation"] = vacants["Type désignation"].apply(get_mode_occupation)

        def format_prix(prix):
            if prix is None:
                return ""
            return int(prix)
        vacants["Loyer proposé"] = vacants["Loyer proposé"].apply(format_prix)
        vacants["Charges proposées"] = vacants["Charges proposées"].apply(format_prix)

        return vacants
    
    @staticmethod
    def get_vacants_traduction():
        traductions = {}
        return traductions
