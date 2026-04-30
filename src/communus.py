import pandas as pd

class Communus:

    def __init__(self, filter):

        self.filter = filter

    @staticmethod
    def get_el():
        df = pd.read_json('data/ega_ExportCOMUNUS.json')
        df = df['COMUNUS']
        return df.to_json(orient='records')
    
    @staticmethod
    def get_el_traduction():
        traductions = {
            'V_OBJLOC': 'Référence',
            'ETAGESA': 'Etage',
            'MONMEN': 'Loyer mensuel',
            'GEOBJED': 'Genre objet',
            'NBPIEC': 'Nombre de pièces',
            'surface': 'Surface'
        }
        return traductions
    
    @staticmethod
    def get_sinistres():
        sinistres = pd.read_excel('data/comunus/sinistres.xlsx')
        bons_travaux = pd.read_excel('data/comunus/bons_travaux.xlsx')
        bons_travaux_agg = (
            bons_travaux.groupby("Sinistre")
            .agg({"N° bon": lambda x: ", ".join(x.dropna().astype(str).unique()),
                  "Devis montant": "sum"
                  })
            .rename(columns={"N° bon": "N° devis",
                             "Devis montant": "Montant devis"
                             })
            .reset_index()
        )

        df_final = sinistres.merge(
            bons_travaux_agg,
            on="Sinistre",
            how="left"
        ).drop(columns=["Sinistre"])

        cols = df_final.columns.tolist()
        cols.remove("Montant devis")
        cols.remove("N° devis")
        index = cols.index("Entreprises") + 1
        cols.insert(index, "Montant devis")
        cols.insert(index + 1, "N° devis")

        df_final = df_final[cols]
        return df_final.to_json(orient='records')
    
    @staticmethod
    def get_sinistres_traduction():
        traductions = {}
        return traductions
    
    @staticmethod
    def get_vacants():
        vacants = pd.read_excel('data/comunus/vacants_all.xlsx')
        vacants.insert(vacants.columns.get_loc("Localité") + 1, "Responsable", "")
        vacants.insert(vacants.columns.get_loc("Loyer annuel net") + 1, "Introduction FA", "")
        vacants.insert(vacants.columns.get_loc("Date proposition") + 1, "Photos logement transmises", "")
        vacants.insert(vacants.columns.get_loc("Prix au m2") + 1, "Travaux", "")
        vacants.insert(vacants.columns.get_loc("Travaux") + 1, "Budget estimatif", "")
        vacants.insert(vacants.columns.get_loc("Travaux désignation") + 1, "Date réception budget comparatif", "")
        vacants.insert(vacants.columns.get_loc("Travaux montant") + 1, "Rendement (%)", "")
        vacants.insert(vacants.columns.get_loc("Nombre de jours") + 1, "Actions entreprises", "")
        df_final = vacants[vacants["Nom juridique 1"] == "Comunus SICAV"].drop(columns=["Nom juridique 1"])
        return df_final.to_json(orient='records')
    
    @staticmethod
    def get_vacants_traduction():
        traductions = {}
        return traductions
